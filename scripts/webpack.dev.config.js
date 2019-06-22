const merge = require('webpack-merge')
const config = require('./config')
const baseWebpackConfig = require('./webpack.base.config')

module.exports = merge(baseWebpackConfig, {
  mode: config.dev.env,
  devtool: config.dev.devtool,
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  output: {
    path: config.dev.output,
    filename: '[name].bundle.js',
    publicPath: config.dev.publicPath
  }
})
