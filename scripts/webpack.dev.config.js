const merge = require('webpack-merge')
const path = require('path')
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
    path: path.join(__dirname, config.dev.output),
    filename: 'app.bundle.js',
    publicPath: config.dev.publicPath
  }
})
