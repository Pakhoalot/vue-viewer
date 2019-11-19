import {
  CLASS_LOADING,
  CLASS_TRANSITION,
  EVENT_LOAD,
  EVENT_TRANSITION_END,
  EVENT_VIEWED,
} from './constants';
import {
  addClass,
  addListener,
  assign,
  forEach,
  getImageNameFromURL,
  getImageNaturalSizes,
  getTransforms,
  isFunction,
  isString,
  removeClass,
  removeListener,
  setData,
  setStyle,
} from './utilities';

export default {
  render() {
    this.initContainer();
    this.initViewer();
    this.renderViewer();
  },

  initContainer() {
    const windowContext = this.windowContext || window;
    this.containerData = {
      width: windowContext.innerWidth,
      height: windowContext.innerHeight,
    };
  },

  initViewer() {
    const { options, parent } = this;
    let viewerData;

    if (options.inline) {
      viewerData = {
        width: Math.max(parent.offsetWidth, options.minWidth),
        height: Math.max(parent.offsetHeight, options.minHeight),
      };

      this.parentData = viewerData;
    }

    if (this.fulled || !viewerData) {
      viewerData = this.containerData;
    }

    this.viewerData = assign({}, viewerData);
  },

  renderViewer() {
    if (this.options.inline && !this.fulled) {
      setStyle(this.viewer, this.viewerData);
    }
  },


  initImage(done) {
    const { options, image, viewerData } = this;
    const footerHeight = this.footer.offsetHeight - this.footer.offsetHeight;
    const viewerWidth = viewerData.width;
    const viewerHeight = Math.max(viewerData.height - footerHeight, footerHeight);
    const oldImageData = this.imageData || {};
    let sizingImage;

    this.imageInitializing = {
      abort() {
        sizingImage.onload = null;
      },
    };

    sizingImage = getImageNaturalSizes(image, (naturalWidth, naturalHeight) => {
      const aspectRatio = naturalWidth / naturalHeight;
      let width = viewerWidth;
      let height = viewerHeight;

      this.imageInitializing = false;

      if (viewerHeight * aspectRatio > viewerWidth) {
        height = viewerWidth / aspectRatio;
      } else {
        width = viewerHeight * aspectRatio;
      }

      width = Math.min(width, naturalWidth);
      height = Math.min(height, naturalHeight);

      const imageData = {
        naturalWidth,
        naturalHeight,
        aspectRatio,
        ratio: width / naturalWidth,
        width,
        height,
        left: (viewerWidth - width) / 2,
        top: (viewerHeight - height) / 2,
      };
      const initialImageData = assign({}, imageData);

      if (options.rotatable) {
        imageData.rotate = oldImageData.rotate || 0;
        initialImageData.rotate = 0;
      }

      if (options.scalable) {
        imageData.scaleX = oldImageData.scaleX || 1;
        imageData.scaleY = oldImageData.scaleY || 1;
        initialImageData.scaleX = 1;
        initialImageData.scaleY = 1;
      }

      this.imageData = imageData;
      this.initialImageData = initialImageData;

      if (done) {
        done();
      }
    });
  },

  renderImage(done) {
    const { image, imageData } = this;

    setStyle(image, assign({
      width: imageData.width,
      height: imageData.height,

      // XXX: Not to use translateX/Y to avoid image shaking when zooming
      marginLeft: imageData.left,
      marginTop: imageData.top,
    }, getTransforms(imageData)));

    if (done) {
      if ((this.viewing || this.zooming) && this.options.transition) {
        const onTransitionEnd = () => {
          this.imageRendering = false;
          done();
        };

        this.imageRendering = {
          abort() {
            removeListener(image, EVENT_TRANSITION_END, onTransitionEnd);
          },
        };

        addListener(image, EVENT_TRANSITION_END, onTransitionEnd, {
          once: true,
        });
      } else {
        done();
      }
    }
  },

  resetImage() {
    // this.image only defined after viewed
    if (this.viewing || this.viewed) {
      const { image } = this;

      if (this.viewing) {
        this.viewing.abort();
      }

      image.parentNode.removeChild(image);
      this.image = null;
    }
  },
};
