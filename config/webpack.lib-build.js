const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/components/vue-viewer/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist/photo-preview'),
    filename: 'vue-viewer.js',
    library: 'vueViewer',
    libraryTarget: 'global'
  },
  module: {
    rules: [
      {        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [
            "style-loader", // 将 JS 字符串生成为 style 节点
            "css-loader", // 将 CSS 转化成 CommonJS 模块
            "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
        ]
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      // If using the runtime only build
      vue$: 'vue/dist/vue.runtime.esm.js' // 'vue/dist/vue.runtime.common.js' for webpack 1
      // Or if using full build of Vue (runtime + compiler)
      // vue$: 'vue/dist/vue.esm.js'      // 'vue/dist/vue.common.js' for webpack 1
    }
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin(),
    // new CleanWebpackPlugin(),
  ],
  
  mode: 'production'
}