const path = require('path');
const prettyjson = require('prettyjson');
const chalk = require('chalk');

const appConfig = require('./app.config');
const webpackConfig = require('./webpack.commons.dll-analyze.config.js');

webpackConfig.entry.main = path.resolve(__dirname, '..', 'lib/server.js');

module.exports = webpackConfig;
if (appConfig.verbose !== false) {
  console.log(chalk.cyan.bold('\nStart webpack server dll analyze config: '));
  console.log(prettyjson.render(module.exports, {
    keysColor: 'cyan'
  }, 4));
  console.log(chalk.cyan.bold('End webpack server dll analyze config\n'));
}
