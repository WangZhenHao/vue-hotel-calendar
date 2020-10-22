const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.base.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function resove(dir) {
	return path.join(__dirname, '..', './example', dir);
}

const prodWebpackConfig = merge(common, {
  mode: "production",
  output: {
    filename: '[name].[chunkhash].js',
    path:  resove('./dist'),
		publicPath: './'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: resove('./dist/index.html'),
      template: resove('./index.html'),
      // chunks: ['index'],
      scriptLoading: 'blocking'
    }),
    new CleanWebpackPlugin(),
  ]
})

module.exports = prodWebpackConfig;