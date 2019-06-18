const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const config = require('./config')

const prodConfig = merge(baseWebpackConfig, {
  mode: config.build.env,
  output: {
    path: path.join(__dirname, config.build.output),
    filename: 'app.bundle.js',
    publicPath: config.build.publicPath,
    chunkFilename: '[name].js'
  },
  devtool: false,
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false
      }
    }
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
  ]
})

if (config.build.bundleAnaly) {
  prodConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = prodConfig