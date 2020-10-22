const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');  
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const common = require('./webpack.base.config.js');
const portfinder = require('portfinder');
const path = require('path');

function resove(dir) {
	return path.join(__dirname, '..', './example', dir);
}

const devWebpackConfig = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].js',
    path:  resove('./dist'),
		publicPath: './'
	},
  devServer: {
		contentBase: resove(''),
		historyApiFallback: false,
		hot: true,
		quiet: true,
		// 出现错误时，在浏览器中显示全屏覆盖层
		overlay: {
			warnings: false, errors: true
		},
		host: '0.0.0.0',
		port: '3000'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: resove('./dist/index.html'),
      template: resove('./index.html'),
      // chunks: ['index'],
      scriptLoading: 'blocking'
    }),
    //启用热替换模块(Hot Module Replacement)，也被称为 HMR。
	  new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = new Promise((reslove, reject) => {
	portfinder.basePort = '3000';
	portfinder.getPort((err, port) => {
		if(err) {

		} else {
			devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
		        compilationSuccessInfo: {
		          messages: [`您的应用运行成功: http://localhost:3000`],
		        }
		    }))
		}


		reslove(devWebpackConfig);
	})
})
