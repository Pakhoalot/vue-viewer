import v from './ViewerManager';

/**
 * 
 * @property {Object} [options] {
 *    element: undefined //图片组父节点
 *    container: document.body // 生成的viewer所用container节点
 * }
 * @property {any} [model] model可以是任何值, 本组件内部只会深度监听该值, 并在该值改变后引起的下一次dom变化时, 初始化viewer, 所以该model应当反映你图片集的变化
 * @method forceInitViewer 强制更新viewer, 在新图片插入dom后需要调用
 */
export default {
  props: ['options', 'model'],
  template: '<div ref="scope"><slot></slot></div>',
  watch: {
    model: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          v.initViewer(this._viewer);
        });
      }
    }
  },
  mounted() {
    const element = this.$refs.scope;
    this._viewer = v.createViewer({ element, });
  },
  destroyed() {
    v.destroyViewer(this._viewer.id);
    this._DOMObserver.disconnect();
  },
}