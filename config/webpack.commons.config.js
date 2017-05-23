const path = require('path');
const webpack = require('webpack');
const mergeWebpack = require('webpack-config-merger');
const appConfig = require('./app.config');
const babelConfig = require('./babel.config');

const isProduction = process.env.NODE_ENV === 'production';
const commonConfig = {
  profile: appConfig.profile,
  context: appConfig.root,
  devtool: false,
  entry: {},
  output: {
    path: appConfig.webpackassets
  },
  resolve: {
    modules: [ 'node_modules' ],
    extensions: [ '.json', '.js', '.jsx' ],
    alias: {
      'universal-redux-config': path.join(process.cwd(), './config/universal-redux.config.js'),
      middleware: appConfig.reduxMiddlewares,
      routes: appConfig.reactRoutes
    }
  },
  resolveLoader: {
    modules: [ appConfig.source, 'node_modules' ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [ {
          loader: 'babel-loader',
          options: babelConfig
        } ]
      },
      {
        test: /\.json$/,
        use: [ 'json-loader' ]
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: [ {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        } ]
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: [ {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        } ]
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [ {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        } ]
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [ 'file-loader' ]
      },
      {
        test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
        use: [ {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/png'
          }
        } ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [ {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml'
          }
        } ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign({
      'process.env': {
        JS_ENV: JSON.stringify(process.env.JS_ENV),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }, appConfig.globals))
  ]
};

const devConfig = {
  output: {
    publicPath: `http://${appConfig.webpackserver.host}:${appConfig.webpackserver.port}/`
  },
  plugins: [
    new webpack.IgnorePlugin(/webpack-assets\.json$/)
  ]
};
const prodConfig = {
  output: {
    publicPath: appConfig.webpackassets
  },
  plugins: [
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
};
const baseDevConfig = mergeWebpack(commonConfig, devConfig);
const baseProdConfig = mergeWebpack(commonConfig, prodConfig);
module.exports = mergeWebpack(isProduction ? baseProdConfig : baseDevConfig, appConfig.webpack);
