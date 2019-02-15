const webpack = require('webpack');
let path = require('path');
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const join = (name) => path.join(__dirname, name)
const DIST_FILE_PATH = '../package/dist'

module.exports = merge(baseWebpackConfig, {
	mode: 'production',
	entry: {
		'app': [
			'babel-polyfill',
			join('../index.js')
		],
	},
	output: {
		path: join(DIST_FILE_PATH),
		filename: 'app.bundle.js',
		publicPath: './',
		chunkFilename: '[name].js'
	},
	devtool: false,
	optimization: {
		splitChunks: {
			cacheGroups: {
				default: false
			},
		}
	},
	plugins: [
		//new BundleAnalyzerPlugin(),
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
		new CopyWebpackPlugin([
			{
				from: join('../main.js'),
				to: join(DIST_FILE_PATH)
			},
			{
				from: join('../assets'),
				to: join(DIST_FILE_PATH + '/assets')
			},
			{
				from: join('../package.json'),
				to: join(DIST_FILE_PATH)
			}
		])
	]
})
