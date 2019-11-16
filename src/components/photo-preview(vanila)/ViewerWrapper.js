import v from './ViewerManager';

/**
 * 
 * @property {Object} [options] {
 *    element: undefined //图片组父节点
 *    container: document.body // 生成的viewer所用container节点
 * }
 * @method forceInitViewer 强制更新viewer, 在新图片插入dom后需要调用
 */
export default {
  props: ['options'],
  template: '<div ref="scope"><slot></slot></div>',
  mounted() {
    this._viewer = v.createViewer({ element: this.$refs.scope, });
  },
  destroyed() {
    v.destroyViewer(this._viewer.id);
  },
  methods: {
    forceInitViewer() {
      v.initViewerAsync(this._viewer);
    },
  },
}