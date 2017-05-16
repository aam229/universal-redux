// require('babel/polyfill');

// begin shared setup
const path = require('path');
const webpack = require('webpack');

// begin dev setup
const host = (process.env.HOST || 'localhost');
const port = parseInt(process.env.PORT, 10) + 1 || 3001;

// begin prod setup
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const vendor = [
  'lodash',
  'react',
  'react-dom',
  'react-router',
  'react-redux',
  'redux',
  'redux-logger',
  'react-router-redux'
];

module.exports = {
  common: {
    context: path.resolve(__dirname, '..'),
    entry: {
      main: [
        path.resolve(__dirname, '..', 'lib/client.js')
      ]
    },
    module: {
      rules: [
        // { test: /\.jsx?$/, exclude: /node_modules/, loaders: jsLoaders }, // now prepended in merge-configs and merge-babel-config
        {
          test: /\.json$/,
          use: ['json-loader']
        },
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }]
        },
        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }]
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream'
            }
          }]
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: ['file-loader']
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml'
            }
          }]
        }
      ]
    },
    resolve: {
      extensions: [ '.json', '.js', '.jsx' ]
    },
    resolveLoader: {
      modules: [
        'src',
        'node_modules'
      ]
    }
  },
  development: {
    devtool: 'inline-source-map',
    entry: {
      main: [
        'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
      ]
    },
    output: {
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: 'http://' + host + ':' + port + '/dist/'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      // hot reload
      new webpack.HotModuleReplacementPlugin(),
      new webpack.IgnorePlugin(/webpack-assets\.json$/),
      new webpack.DefinePlugin({
        __CLIENT__: true,
        __SERVER__: false
      })
    ]
  },
  production: {
    devtool: 'source-map',
    entry: {
      vendor
    },
    output: {
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: '/dist/'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('css-loader')
        }
      ]
    },
    plugins: [
      // css files from the extract-text-plugin loader
      new ExtractTextPlugin('[name]-[chunkhash].css', { allChunks: true }),
      new webpack.DefinePlugin({
        __CLIENT__: true,
        __SERVER__: false
      }),

      // set global consts
      new webpack.DefinePlugin({
        'process.env': {
          // Useful to reduce the size of client-side libraries, e.g. react
          NODE_ENV: JSON.stringify('production')
        }
      }),

      // optimizations
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names: [ 'vendor' ],
        minChunks: Infinity
      })
    ]
  }
};
