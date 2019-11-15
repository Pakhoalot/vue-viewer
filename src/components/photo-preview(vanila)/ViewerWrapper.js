import v from './ViewerManager';
export default {
  props: ['options'],
  template: '<div ref="scope"><slot></slot></div>',
  mounted() {
    this._viewer = v.createViewer({ element: this.$refs.scope, });
  },
  destroyed() {
    v.destroyViewer(this._viewer.id);
  }
}