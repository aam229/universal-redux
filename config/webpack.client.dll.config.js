const fs = require('fs');
const path = require('path');
const prettyjson = require('prettyjson');
const chalk = require('chalk');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const IsomorphicClientPlugin = require('../plugins/IsomorphicClientPlugin');
const appConfig = require('./app.config');
const webpackConfig = require('./webpack.commons.dll.config.js');

const dllModules = JSON.parse(fs.readFileSync(path.resolve(appConfig.dll.root, appConfig.dll.client)));

webpackConfig.entry.dll = dllModules;
webpackConfig.output.filename = 'client-dll-[chunkhash].js';
webpackConfig.output.library = 'dll_lib';
webpackConfig.output.libraryTarget = 'window';

webpackConfig.module.rules.push({
  test: /\.css$/,
  loader: ExtractTextPlugin.extract('css-loader')
});
webpackConfig.plugins.push(new IsomorphicClientPlugin({
  publicPath: path.relative(appConfig.root, appConfig.webpackassets),
  output: path.resolve(appConfig.webpackassets, 'client-dll-assets.json')
}));
webpackConfig.plugins.push(new webpack.DllPlugin({
  path: path.resolve(__dirname, '../client-dll-manifest.json'),
  name: 'dll_lib'
}));
webpackConfig.plugins.push(new ExtractTextPlugin({
  filename: 'client-dll-[chunkhash].css',
  allChunks: true
}));

if (process.env.NODE_ENV === 'development') {
  webpackConfig.devtool = 'cheap-module-eval-source-map';
} else {
  webpackConfig.devtool = 'source-map';
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
}

module.exports = webpackConfig;
if (appConfig.verbose !== false) {
  console.log(chalk.cyan.bold('\nStart webpack client dll build config: '));
  console.log(prettyjson.render(module.exports, {
    keysColor: 'cyan'
  }, 4));
  console.log(chalk.cyan.bold('End webpack client dll build config\n'));
}
