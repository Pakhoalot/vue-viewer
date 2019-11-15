/**
 * 重塑节点, 添加mask,和wrapper
 */
export default {
  render(h) {
    const slot = this.$slots.default;
    const root = h('div', {}, slot);
    
    traverse(slot, (nodePair, i) => {
      const imageWrapper = h(
        'div',
        {
          class: 'viewer-photo-wrapper',
          on: {
            click: () => this.onClick(i),
          }
        }, 
        [
          h('div', { class: 'viewer-photo-mask' }),
          nodePair[1],
        ]
      );
      let index = nodePair[0].children.indexOf(nodePair[1]);
      nodePair[0].children[index] = imageWrapper;
    })
    console.log(root);
    return root;
  },
  methods: {
    onClick(index) {
      this.$emit('photo-click', index);
    }
  },
  updated() {
    console.log('photos updated fire');
  }
}

function traverse(root, done) {
  console.log('traverse fire');
  const queue = [];
  let node = root;
  let nodePair;
  let index = 0;
  if(Array.isArray(node)) queue.push(...node.map(_ => [null, _]));
  else queue.push([null, node]);
  while (queue.length) {
    nodePair = queue.shift(); 
    if(nodePair[1].tag == 'img') {
      done(nodePair, index++);
    }
    else if (nodePair[1].children) {
      nodePair[1].children.forEach(childnode => queue.push([nodePair[1], childnode]));
    }
  }
}