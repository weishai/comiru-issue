
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  context: path.resolve(__dirname, '../'),

  entry: {
    vendor: [
      './src/js/utils/helpers.js',
      './src/js/components/tagInput.js',
      './src/js/components/intersection-observer-polyfill.js',
      './src/js/components/lazyLoad.js'
    ],
    desc3: [
      './src/js/page-desc3/app.js'
    ]
  },

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: './js/[name].js'
  },

  devServer: {
    port: 8081,
    contentBase: path.resolve(__dirname, '../src'),
    liveReload: true,
    watchContentBase: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src', 'desc3.html')
    }),

    new CopyPlugin({
      patterns: [
        {
          from: './src/js/utils/mock.js',
          to: 'js/utils/',
        },
        {
          from: './src/css',
          to: 'css/',
          info: {
            minimized: true
          }
        },
        {
          from: './src/img',
          to: 'img/'
        }
      ],
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
