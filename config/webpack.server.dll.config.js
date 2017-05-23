const fs = require('fs');
const path = require('path');
const prettyjson = require('prettyjson');
const chalk = require('chalk');
const webpack = require('webpack');

const appConfig = require('./app.config');
const webpackConfig = require('./webpack.commons.dll.config.js');

const dllModules = JSON.parse(fs.readFileSync(path.resolve(appConfig.dll.root, appConfig.dll.server)));

webpackConfig.entry.dll = dllModules;
webpackConfig.module.rules.push({
  test: /\.css$/,
  loader: 'ignore-loader'
});
webpackConfig.plugins.push(new webpack.DllPlugin({
  path: path.resolve(__dirname, '../server-dll-manifest.json'),
  name: 'server_dll'
}));
webpackConfig.output.filename = 'server_dll.js';
webpackConfig.output.libraryTarget = 'commonjs2';
webpackConfig.target = 'node';

module.exports = webpackConfig;
if (appConfig.verbose !== false) {
  console.log(chalk.cyan.bold('\nStart webpack server dll build config: '));
  console.log(prettyjson.render(module.exports, {
    keysColor: 'cyan'
  }, 4));
  console.log(chalk.cyan.bold('End webpack server dll build config\n'));
}
