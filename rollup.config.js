const babel = require('rollup-plugin-babel');
const VuePlugin = require('rollup-plugin-vue');
const name = 'vue-viewer';
module.exports = {
  input: 'src/components/vue-viewer/index.js',
  output: [
    // {
    //   name,
    //   file: `dist/${name}.js`,
    //   format: 'umd',
    // },
    // {
    //   name,
    //   file: `dist/${name}.common.js`,
    //   format: 'cjs',
    // },
    // {
    //   name,
    //   file: `dist/${name}.esm.js`,
    //   format: 'esm',
    // },
    {
      format: 'iife',
      file: 'dist/library.js'
    },
  ],
  external: ['vue'],
  plugins: [
    VuePlugin({}),
    // babel(),
  ],
};
