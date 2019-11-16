const babel = require('rollup-plugin-babel');
const VuePlugin = require('rollup-plugin-vue');
const name = 'qzViewer';
module.exports = {
  input: 'src/components/photo-preview(vanila)/index.js',
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
      file: `dist/${name}.js`,
      name: name,
      globals: {
        WXApp: 'WXApp'
      }
    },
  ],
  external: ['vue'],
  plugins: [
    VuePlugin({}),
    babel(),
  ],
};
