const path = require('path');
const prettyjson = require('prettyjson');
const chalk = require('chalk');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const IsomorphicClientPlugin = require('../plugins/IsomorphicClientPlugin');
const appConfig = require('./app.config.js');
const webpackConfig = require('./webpack.commons.config.js');
const webpackUniversalPluginsConfig = require('./webpack.commons.universal-plugins.config.js');

webpackConfig.entry.main = webpackUniversalPluginsConfig.concat([
  path.resolve(__dirname, '..', 'lib/client.js') ]
);
webpackConfig.output.filename = 'client-[chunkhash].js';
webpackConfig.devtool = 'cheap-module-eval-source-map';

webpackConfig.module.rules.push({
  test: /\.css$/,
  loader: ExtractTextPlugin.extract('css-loader')
});
webpackConfig.plugins.push(new IsomorphicClientPlugin({
  publicPath: webpackConfig.output.publicPath,
  output: path.resolve(appConfig.webpackassets, 'client-assets.json')
}));
webpackConfig.plugins.push(new webpack.DllReferencePlugin({
  context: '.',
  manifest: require(path.resolve(__dirname, '../client-dll-manifest.json'))
}));
webpackConfig.plugins.push(new ExtractTextPlugin({
  filename: 'client-[chunkhash].css',
  allChunks: true
}));

module.exports = webpackConfig;

if (appConfig.verbose !== false) {
  console.log(chalk.blue.bold('\nStart webpack client config: '));
  console.log(prettyjson.render(module.exports, {
    keysColor: 'blue'
  }, 4));
  console.log(chalk.blue.bold('End webpack client config\n'));
}
