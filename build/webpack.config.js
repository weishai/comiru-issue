
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  context: path.resolve(__dirname, '../'),

  entry: {
    index: './src/js/index.js'
  },

  output: {
    path: path.resolve(__dirname, '../dist')
  },

  devServer: {
    port: 8081,
    contentBase: path.resolve(__dirname, '../src'),
    liveReload: true,
    watchContentBase: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src', 'desc1.html')
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
