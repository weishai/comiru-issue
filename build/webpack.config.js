
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const path = require('path')

module.exports = (env, opts) => {
  console.log('opts: ', opts.mode);
  return {
    context: path.resolve(__dirname, '../'),
  
    entry: {
      vendor: [
        './src/css/reset.css',
        './src/js/utils/helpers.js',
        './src/css/taginput.css',
        './src/js/components/tagInput.js',
        './src/js/components/intersection-observer-polyfill.js',
        './src/js/components/lazyLoad.js',
      ],
      desc3: [
        './src/css/desc3.css',
        './src/js/page-desc3/app.js',
      ]
    },
  
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: opts.mode == 'development' ? './js/[name].js' : './js/[name].[chunkhash].js'
    },
  
    devServer: {
      port: 8081,
      contentBase: path.resolve(__dirname, '../src'),
      liveReload: true
      // watchContentBase: true
    },
  
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../src', 'tpl-desc3.html'),
        chunks: ['vendor', 'desc3']
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
        filename: opts.mode == 'development' ? './css/[name].css' : './css/[name].[chunkhash].css'
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
}
