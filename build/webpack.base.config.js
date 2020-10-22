const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resove(dir) {
	return path.join(__dirname, '..', './example', dir);
}

module.exports = {
  resolve: {
	  alias: {
		  'vue-hotel-calendar': resove('../src/index.vue')
	  }
	},
  entry: {
    'index': resove('index.js')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: false
        }
      },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     'vue-style-loader',
      //     'css-loader',
      //     'sass-loader'
      //   ]
      // },
      // // ... 忽略其它规则
      {
        test: /\.css$/,
        use: [
          // 'vue-style-loader',
          // process.env.NODE_ENV !== 'production'
          //   ? 'vue-style-loader'
          //   : MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin(),
    // // ... 忽略 vue-loader 插件
    // new MiniCssExtractPlugin({
    //   filename: resove('./dist/style.css')
    // })
    // new MiniCssExtractPlugin({
    //   filename: resove('./dist/style.css')
    // })
  ]
}