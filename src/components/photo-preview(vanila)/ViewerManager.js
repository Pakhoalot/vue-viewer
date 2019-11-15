import Viewer from './viewer';

class ViewerManager {
  constructor() {
    this.viewers = [];
    this.idManger = 0;
    this.idViewerMap = new Map();
  }
  createViewer(options) {
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
  getViewer(id) {
    return this.idViewerMap.get(id);
  }
  initViewer(id) {
    let viewer;
    if(typeof id == 'object') viewer = id;
    else viewer = this.getViewer(id);
    const options = viewer.v_options;
    this.viewers.filter(_=>_.id != viewer.id);
    viewer.destroy();
    viewer = this.create(options);
    this.idViewerMap.set(viewer.id, viewer);
    this.viewers.push(viewer);
  }
  initViewerAsync(id) {
    return new Promise((res) => {
      setTimeout(() => {
        res(this.initViewer(id));
      })
    })
  }
  destroyViewer(id) {
    let viewer;
    if(typeof id == 'object') viewer = id;
    else viewer = this.getViewer(id);
    this.viewers.filter(_=>_.id != viewer.id);
    this.idViewerMap.delete(viewer.id);
    viewer.destroy();
  }
  destroy() {
    while(this.viewers.length) {
      this.viewers.pop().destory();
    }
    this.idViewerMap.clear();
  }
}

const singleViewerManager = new ViewerManager();
export default singleViewerManager;
