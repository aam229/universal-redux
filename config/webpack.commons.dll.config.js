const webpack = require('webpack');
const appConfig = require('./app.config');
const babelConfig = require('./babel.config');

module.exports = {
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
