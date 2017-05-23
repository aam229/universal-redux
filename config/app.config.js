const fs = require('fs');
const path = require('path');
const lodash = require('lodash');
const prettyjson = require('prettyjson');
const chalk = require('chalk');

/**
 * This file is responsible for merging the app defined configuration with the default
 * configuration values
 */

const appConfigPath = path.join(process.cwd(), './config/universal-redux.build.config.js');
const appConfig = require(path.resolve(appConfigPath));

function resolvePath(name, context, providedPath, defaultPath) {
  const resolvedPath = path.resolve(context, (providedPath !== undefined) ? providedPath : defaultPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`The ${name} path '${resolvedPath}' from the universal-redux config does not exist`);
  }
  return resolvedPath;
}

// Root path of the application
appConfig.root = resolvePath('root', process.cwd(), appConfig.root, '');

// Source path of the application
appConfig.source = resolvePath('source', appConfig.root, appConfig.source, 'src');

// React routes file
appConfig.reactRoutes = resolvePath('reactRoutes', appConfig.source, appConfig.reactRoutes, 'routes.js');

// Redux middleware file
appConfig.reduxMiddlewares = resolvePath('reduxMiddlewares', appConfig.source, appConfig.reduxMiddlewares, 'redux/middleware/index.js');

// Server static assets folder
appConfig.webpackassets = resolvePath('server.assets', appConfig.root, appConfig.webpackassets, 'static/webpack');

// Source path of the application
appConfig.dll = appConfig.dll || {};
appConfig.dll.root = resolvePath('dll', appConfig.root, appConfig.dll.root, 'config/');

const defaultAppConfig = {
  profile: false,
  verbose: true,
  plugins: [],
  globals: {},
  html: {},
  webpack: {},
  dll: {
    client: 'universal-redux-dll-client.config.json',
    server: 'universal-redux-dll-server.config.json',
    ignore: []
  }
};

module.exports = lodash.merge(defaultAppConfig, appConfig);

if (appConfig.verbose !== false) {
  console.log(chalk.cyan.bold('\nStart universal redux config: '));
  console.log(prettyjson.render(module.exports, {
    keysColor: 'cyan'
  }, 4));
  console.log(chalk.cyan.bold('End universal redux config\n'));
}

