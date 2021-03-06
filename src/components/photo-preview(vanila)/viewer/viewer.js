import DEFAULTS from './defaults';
import TEMPLATE from './template';
import render from './render';
import events from './events';
import handlers from './handlers';
import methods from './methods';
import others from './others';
import {
  BUTTONS,
  CLASS_CLOSE,
  CLASS_FADE,
  CLASS_FIXED,
  CLASS_FULLSCREEN,
  CLASS_HIDE,
  CLASS_INVISIBLE,
  DATA_ACTION,
  EVENT_CLICK,
  EVENT_LOAD,
  EVENT_READY,
  NAMESPACE,
  REGEXP_SPACES,
  WINDOW,
} from './constants';
import {
  addClass,
  hasClass,
  addListener,
  assign,
  dispatchEvent,
  forEach,
  getResponsiveClass,
  hyphenate,
  isFunction,
  isNumber,
  isPlainObject,
  isString,
  isUndefined,
  removeListener,
  setData,
  setStyle,
  toggleClass,
  buildButton,
  buildMask,
} from './utilities';

const AnotherViewer = WINDOW.Viewer;

class Viewer {
  /**
   * Create a new Viewer.
   * @param {Element} element - The target element for viewing.
   * @param {Object} [options={}] - The configuration options.
   */
  constructor(element, options = {}) {
    if (!element || element.nodeType !== 1) {
      throw new Error('The first argument is required and must be an element.');
    }

    this.element = element;
    this.options = assign({}, DEFAULTS, isPlainObject(options) && options);
    this.action = false;
    this.fading = false;
    this.fulled = false;
    this.hiding = false;
    this.imageClicked = false;
    this.imageData = {};
    this.index = this.options.initialViewIndex;
    this.isImg = false;
    this.isShown = false;
    this.length = 0;
    this.played = false;
    this.playing = false;
    this.pointers = {};
    this.ready = false;
    this.showing = false;
    this.timeout = false;
    this.tooltipping = false;
    this.viewed = false;
    this.viewing = false;
    this.wheeling = false;
    this.zooming = false;
    this.zoomMode = 'fit'; //fit为适应界面, origin 为原始大小
    this.windowContext = window;
    this.init();
  }

  init() {
    const { element, options } = this;

    if (element[NAMESPACE]) {
      return;
    }

    element[NAMESPACE] = this;

    const isImg = element.tagName.toLowerCase() === 'img';
    const images = [];
    const imageWrapperMap = new Map();
    const addWrapper = (image) => {
      const imageParent = image.parentNode;
      const imageWrapper = document.createElement('div');
      addClass(imageWrapper, `${NAMESPACE}-image-wrapper`);
      
      if(options.mask) {
        const mask = buildMask();
        imageWrapper.appendChild(mask);
      }
      imageWrapper.appendChild(image);
      imageParent.appendChild(imageWrapper);
      addClass(image, `${NAMESPACE}-image`);
      imageWrapperMap.set(image, imageWrapper);
    }
    forEach(isImg ? [element] : element.querySelectorAll('img'), (image) => {
      if (isFunction(options.filter)) {
        if (options.filter.call(this, image)) {
          addWrapper(image)
          images.push(image);
        }
      } else {
        addWrapper(image)
        images.push(image);
      }
    });
    this.isImg = isImg;
    this.length = images.length;
    this.images = images;

    const { ownerDocument } = options.container || element;
    const body = ownerDocument.body || ownerDocument.documentElement;

    this.body = body;
    this.windowContext = options.windowContext || window;
    this.scrollbarWidth = window.innerWidth - ownerDocument.documentElement.clientWidth;
    this.initialBodyPaddingRight = window.getComputedStyle(body).paddingRight;

    // Override `transition` option if it is not supported
    if (isUndefined(document.createElement(NAMESPACE).style.transition)) {
      options.transition = false;
    }

    if (options.inline) {
      let count = 0;
      const progress = () => {
        count += 1;

        if (count === this.length) {
          let timeout;

          this.initializing = false;
          this.delaying = {
            abort: () => {
              clearTimeout(timeout);
            },
          };

          // build asynchronously to keep `this.viewer` is accessible in `ready` event handler.
          timeout = setTimeout(() => {
            this.delaying = false;
            this.build();
          }, 0);
        }
      };

      this.initializing = {
        abort() {
          forEach(image, (image) => {
            if (!image.complete) {
              removeListener(imageWrapperMap.get(image), EVENT_LOAD, progress);
            }
          });
        },
      };

      forEach(imageWrappers, (image) => {
        if (image.complete) {
          progress();
        } else {
          addListener(imageWrapperMap.get(image), EVENT_LOAD, progress, {
            once: true,
          });
        }
      });
    } else {
      addListener(element, EVENT_CLICK, (this.onStart = ({ target }) => {
        const image = target.nextSibling;
        if (image && image.tagName == 'IMG' && hasClass(image, `${NAMESPACE}-image`)
          && (!isFunction(options.filter) || options.filter.call(this, image))) {
          this.view(this.images.indexOf(image));
        }
      }));
    }

  }

  build() {
    if (this.ready) {
      return;
    }

    const { element, options } = this;
    const parent = element.parentNode;
    const template = document.createElement('div');

    template.innerHTML = TEMPLATE;

    const viewer = template.querySelector(`.${NAMESPACE}-container`);
    const title = viewer.querySelector(`.${NAMESPACE}-title`);
    const toolbar = viewer.querySelector(`.${NAMESPACE}-toolbar`);
    const canvas = viewer.querySelector(`.${NAMESPACE}-canvas`);
    const topRight = viewer.querySelector(`.${NAMESPACE}-top-right-bar`)
    this.parent = parent;
    this.viewer = viewer;
    this.title = title;
    this.toolbar = toolbar;
    this.canvas = canvas;
    this.footer = viewer.querySelector(`.${NAMESPACE}-footer`);
    this.tooltipBox = viewer.querySelector(`.${NAMESPACE}-tooltip`);
    this.player = viewer.querySelector(`.${NAMESPACE}-player`);

    addClass(title, !options.title ? CLASS_HIDE : getResponsiveClass(Array.isArray(options.title)
      ? options.title[0]
      : options.title));
    toggleClass(topRight, CLASS_HIDE, !options.button);
    
    let button;
    if(options.button) {
      button = document.createElement('div');
      this.button = button;
      const buttonWrapper = buildButton(button, 'close');
      setData(button, DATA_ACTION, 'mix');
      
      topRight.appendChild(buttonWrapper);
    }

    if (options.backdrop) {
      addClass(viewer, `${NAMESPACE}-backdrop`);

      if (!options.inline && options.backdrop !== 'static') {
        setData(canvas, DATA_ACTION, 'hide');
      }
    }

    if (isString(options.className) && options.className) {
      // In case there are multiple class names
      options.className.split(REGEXP_SPACES).forEach((className) => {
        addClass(viewer, className);
      });
    }

    if (options.toolbar) {
      const list = document.createElement('div');
      addClass(list, `button-group`)
      const custom = isPlainObject(options.toolbar);
      const zoomButtons = BUTTONS.slice(0, 3);
      const rotateButtons = BUTTONS.slice(7, 9);
      const scaleButtons = BUTTONS.slice(9);

      if (!custom) {
        addClass(toolbar, getResponsiveClass(options.toolbar));
      }

      forEach(custom ? options.toolbar : BUTTONS, (value, index) => {
        const deep = custom && isPlainObject(value);
        const name = custom ? hyphenate(index) : value;
        const show = deep && !isUndefined(value.show) ? value.show : value;

        if (
          !show
          || (!options.zoomable && zoomButtons.indexOf(name) !== -1)
          || (!options.rotatable && rotateButtons.indexOf(name) !== -1)
          || (!options.scalable && scaleButtons.indexOf(name) !== -1)
        ) {
          return;
        }

        const size = deep && !isUndefined(value.size) ? value.size : value;
        const click = deep && !isUndefined(value.click) ? value.click : value;
        let item;
        if(name == 'view-original') item = document.createElement('a');
        else item = document.createElement('div');
        
        this[`${name}-btn`] = item;
        const itemWrapper = buildButton(item, name, NAMESPACE);
        

        if (!isFunction(click)) {
          setData(item, DATA_ACTION, name);
        }

        if (isNumber(show)) {
          addClass(item, getResponsiveClass(show));
        }

        if (['small', 'large'].indexOf(size) !== -1) {
          addClass(item, `${NAMESPACE}-${size}`);
        } else if (name === 'play') {
          addClass(item, `${NAMESPACE}-large`);
        } else if (name === 'toggle-zoom') {
          addClass(item, `${NAMESPACE}-${this.zoomMode}`);
          this.toggleZoomButton = item;
        } else if (name === 'zoom-fit') {
          this.zoomFitButton = item;
        }

        if (isFunction(click)) {
          addListener(item, EVENT_CLICK, click);
        }

        list.appendChild(itemWrapper);
      });

      toolbar.appendChild(list);
    } else {
      addClass(toolbar, CLASS_HIDE);
    }
    if (!options.rotatable) {
      const rotates = toolbar.querySelectorAll('li[class*="rotate"]');

      addClass(rotates, CLASS_INVISIBLE);
      forEach(rotates, (rotate) => {
        toolbar.appendChild(rotate);
      });
    }

    if (options.inline) {
      addClass(button, CLASS_FULLSCREEN);
      setStyle(viewer, {
        zIndex: options.zIndexInline,
      });

      if (window.getComputedStyle(parent).position === 'static') {
        setStyle(parent, {
          position: 'relative',
        });
      }

      parent.insertBefore(viewer, element.nextSibling);
    } else {
      addClass(button, CLASS_CLOSE);
      addClass(viewer, CLASS_FIXED);
      addClass(viewer, CLASS_FADE);
      addClass(viewer, CLASS_HIDE);

      setStyle(viewer, {
        zIndex: options.zIndex,
      });

      let { container } = options;

      if (isString(container)) {
        container = element.ownerDocument.querySelector(container);
      }

      if (!container) {
        container = this.body;
      }

      container.appendChild(viewer);
    }

    if (options.inline) {
      this.render();
      this.bind();
      this.isShown = true;
    }

    this.ready = true;

    if (isFunction(options.ready)) {
      addListener(element, EVENT_READY, options.ready, {
        once: true,
      });
    }

    if (dispatchEvent(element, EVENT_READY) === false) {
      this.ready = false;
      return;
    }

    if (this.ready && options.inline) {
      this.view(this.index);
    }
  }

  /**
   * Get the no conflict viewer class.
   * @returns {Viewer} The viewer class.
   */
  static noConflict() {
    window.Viewer = AnotherViewer;
    return Viewer;
  }

  /**
   * Change the default options.
   * @param {Object} options - The new default options.
   */
  static setDefaults(options) {
    assign(DEFAULTS, isPlainObject(options) && options);
  }
}

assign(Viewer.prototype, render, events, handlers, methods, others);

export default Viewer;
