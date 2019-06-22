const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const theme = require('./theme')
const config = require('./config')

module.exports = {
  entry: {
    app: `${config.build.basePath}/index.js`
  },
  module: {
    rules: [
      {
        test: /(\.css|\.less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              url: false
            }
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: theme || {},
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        exclude: /node_modules/,
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    }),
    new HtmlWebpackPlugin({
      template: config.build.template
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  },
  target: 'electron-renderer'
}
