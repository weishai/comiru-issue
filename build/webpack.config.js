
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const path = require('path')

module.exports = {
  context: path.resolve(__dirname, '../'),

  entry: {
    vendor: [
      './src/js/utils/helpers.js',
      './src/js/components/tagInput.js',
      './src/js/components/intersection-observer-polyfill.js',
      './src/js/components/lazyLoad.js',
      './src/css/reset.css',
      './src/css/taginput.css'
    ],
    desc3: [
      './src/js/page-desc3/app.js',
      './src/css/desc3.css'
    ]
  },

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: './js/[name].js'
  },

  devServer: {
    port: 8081,
    contentBase: path.resolve(__dirname, '../src'),
    liveReload: true
    // watchContentBase: true
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
        }
      ],
    }),

    new MiniCssExtractPlugin({
      filename: './css/[name].css'
    })
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
    }
    ]
  },

  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ]
  }
}
