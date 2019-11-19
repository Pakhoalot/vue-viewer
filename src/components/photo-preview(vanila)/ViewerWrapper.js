import v from './ViewerManager';

/**
 * 
 * @property {Object} [options] {
 *    container: document.body // 生成的viewer所用container节点
 *    zIndex: 99 //生成的viewer zindex
 *    windowContext: window //指示window上下文, 当你在iframe中使用该组件, 而又想全屏幕展示时, 你需要Container设置到最顶层的容器中, 这时需要重新设定windowContext为顶层容器的window, 以校正这个组件
 *    mask: true //指示是否生成图片mask层, 让你想自定义mask层, 这个参数应显式置为false
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
    let { container, zIndex, windowContext, mask } = this.options || {};
    const element = this.$refs.scope;
    this._viewer = v.createViewer({ element, container, zIndex: zIndex || 99, windowContext, mask: mask || true });
  },
  destroyed() {
    v.destroyViewer(this._viewer.id);
  },
  methods: {
    view(index) {
      this._viewer && this._viewer.view(index);
    }
  },
}