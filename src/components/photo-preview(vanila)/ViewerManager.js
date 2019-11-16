import Viewer from './viewer/index';

/**
 * viewer管理类, 提供管理单例统一管理所有viewer;
 * 
 *
 * @class ViewerManager
 */
class ViewerManager {
  constructor() {
    this.viewers = [];
    this.idManger = 0;
    this.idViewerMap = new Map();
  }
  /**
   * 创建一个viewer并返回
   *
   * @param {Object} [options] {
   *     element: null,
   *     container: document.body,
   *   }
   * @returns {Object} viewer示例
   * @memberof ViewerManager
   */
  createViewer(options = {
    element: null,
    container: document.body,
  }) {
    const viewer = this.create(options);
    this.idViewerMap.set(viewer.id, viewer);
    this.viewers.push(viewer);
    return viewer;
  }
  create(options) {
    const element = options.element;
    const zIndex = options.zIndex || 99;
    if(!element) throw Error('element must given');
    const viewer = new Viewer(element, {
      container: options.container || document.body,
      button: true,
      navbar: false,
      title: false,
      toolbar: {
        prev: true,
        next: true,
        toggleZoom: true,
        download: true,
      },
      loop: false,
      tooltip: true,
      zIndex,
      backdrop: true,
      minZoomRatio: 0.25,
      maxZoomRatio: 4,
      ...event
    });
    viewer.id = this.idManger ++;
    viewer.v_options = options;
    return viewer;
  }
  /**
   * 根据id返回对应viewer 
   *
   * @param {number} id
   * @returns
   * @memberof ViewerManager
   */
  getViewer(id) {
    return this.idViewerMap.get(id);
  }
  /**
   * 初始化对应viewer, 用于在图片组dom结构改变后调用以返回正确的viewer
   *
   * @param {Object | number} id viewer示例或对应id
   * @memberof ViewerManager
   */
  initViewer(id) {
    let viewer;
    if(typeof id == 'object') viewer = id;
    else viewer = this.getViewer(id);
    const options = viewer.v_options;
    this.viewers = this.viewers.filter(_=>_.id != viewer.id);
    this.destroyViewer(viewer);
    viewer = this.create(options);
    this.idViewerMap.set(viewer.id, viewer);
    this.viewers.push(viewer);
  }
  /**
   * 以异步形式初始化对应viewer
   *
   * @param {Object | number} id viewer示例或对应id
   * @returns {Promise}
   * @memberof ViewerManager
   */
  initViewerAsync(id) {
    return new Promise((res) => {
      setTimeout(() => {
        res(this.initViewer(id));
      })
    })
  }
  /**
   * 销毁对应viewer
   *
   * @param {Object | number} id viewer示例或对应id
   * @memberof ViewerManager
   */
  destroyViewer(id) {
    let viewer;
    if(typeof id == 'object') viewer = id;
    else viewer = this.getViewer(id);
    this.viewers.filter(_=>_.id != viewer.id);
    this.idViewerMap.delete(viewer.id);
    viewer.destroy();
  }
  /**
   * 销毁所有viewer
   *
   * @memberof ViewerManager
   */
  destroy() {
    while(this.viewers.length) {
      this.viewers.pop().destory();
    }
    this.idViewerMap.clear();
  }
}

const singleViewerManager = new ViewerManager();
export default singleViewerManager;
