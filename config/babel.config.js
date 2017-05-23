const lodash = require('lodash');
const prettyjson = require('prettyjson');
const chalk = require('chalk');
const appConfig = require('./app.config');

const defaultBabelConfig = {
  presets: [
    'babel-preset-es2015',
    'babel-preset-stage-0',
    'babel-preset-react'
  ],
  plugins: [
    [ 'babel-plugin-transform-runtime' ],
    [ 'babel-plugin-typecheck' ],
    [ 'babel-plugin-transform-decorators-legacy' ],
    [ 'babel-plugin-transform-async-to-generator' ]
  ],
  env: {
    development: {
      plugins: []
    },
    production: {
      plugins: []
    }
  }
};

module.exports = lodash.merge(defaultBabelConfig, appConfig.babel);

if (appConfig.verbose !== false) {
  console.log(chalk.cyan.bold('\nStart babel config: '));
  console.log(prettyjson.render(module.exports, {
    keysColor: 'cyan'
  }, 4));
  console.log(chalk.cyan.bold('End babel config\n'));
}

