const path = require('path');
const prettyjson = require('prettyjson');
const chalk = require('chalk');

const appConfig = require('./app.config');
const webpackConfig = require('./webpack.commons.dll-analyze.config.js');

webpackConfig.entry.main.push(path.resolve(__dirname, '..', 'lib/client.js'));

module.exports = webpackConfig;
if (appConfig.verbose !== false) {
  console.log(chalk.cyan.bold('\nStart webpack client dll analyze config: '));
  console.log(prettyjson.render(module.exports, {
    keysColor: 'cyan'
  }, 4));
  console.log(chalk.cyan.bold('End webpack client dll analyze config\n'));
}
