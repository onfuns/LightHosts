const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin')
const theme = require('./theme')
const config = require('./config')

module.exports = {
  entry: {
    app: `${config.build.basePath}/index.tsx`
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
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
        test: /\.(jsx?|tsx?)$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [
                  tsImportPluginFactory({
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true
                  })
                ]
              }),
              compilerOptions: {
                module: 'es2015'
              }
            }
          }
        ]
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
    }),
    new AntdDayjsWebpackPlugin()
  ],
  node: {
    __dirname: false,
    __filename: false
  },
  target: 'electron-renderer'
}
