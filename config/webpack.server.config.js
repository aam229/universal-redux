const path = require('path');
const prettyjson = require('prettyjson');
const chalk = require('chalk');
const webpack = require('webpack');

const dllManifest = require('../server-dll-manifest.json');
const appConfig = require('./app.config.js');
const webpackConfig = require('./webpack.commons.config.js');
const webpackUniversalPluginsConfig = require('./webpack.commons.universal-plugins.config.js');

webpackConfig.entry.main = webpackUniversalPluginsConfig.concat([
  path.resolve(__dirname, '..', 'lib/server.js') ]
);
webpackConfig.devtool = false;
webpackConfig.output.filename = 'server.js';
webpackConfig.target = 'node';
webpackConfig.module.rules.push({
  test: /\.css$/,
  loader: 'ignore-loader'
});
webpackConfig.plugins.push(new webpack.DllReferencePlugin({
  context: '.',
  name: './server_dll',
  sourceType: 'commonjs',
  manifest: dllManifest
}));
module.exports = webpackConfig;

if (appConfig.verbose !== false) {
  console.log(chalk.blue.bold('\nStart webpack server config: '));
  console.log(prettyjson.render(module.exports, {
    keysColor: 'blue'
  }, 4));
  console.log(chalk.blue.bold('End webpack server config\n'));
}
