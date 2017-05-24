const chalk = require('chalk');
const appConfig = require('./app.config');
const hooks = require('../lib/shared/hooks');

const isProduction = process.env.NODE_ENV === 'production';
const isServer = process.env.JS_ENV === 'server';

function findPluginConfig(plugin, sourceDir) {
  const pluginPath = [
    `universal-redux-plugin-${plugin}`,
    `${sourceDir}/${plugin}`
  ].find((pp) => {
    try {
      require.resolve(pp);
      return true;
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') console.error(e);
      return false;
    }
  });
  if (!pluginPath) {
    return null;
  }
  const pluginConfigPath = [
    `${pluginPath}/config`,
    `${pluginPath}.config`
  ].find((pp) => {
    try {
      require.resolve(pp);
      return true;
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') console.error(e);
      return false;
    }
  });
  const config = pluginConfigPath ? require(pluginConfigPath) : {};
  return {
    path: pluginPath,
    environments: config.environments
  };
}

module.exports = appConfig.plugins
  .map((pluginKey) => {
    const pluginConfig = findPluginConfig(pluginKey, appConfig.source);
    if (!pluginConfig) {
      console.log(chalk.red(`Could not resolve universal-redux plugin ${pluginKey}`));
      return null;
    }
      // Check that we even need the plugin in the current environment;
    if (pluginConfig.environments) {
      if ((pluginConfig.environments.indexOf(hooks.environments.SERVER) === -1 && isServer) ||
          (pluginConfig.environments.indexOf(hooks.environments.CLIENT) === -1 && !isServer) ||
          (pluginConfig.environments.indexOf(hooks.environments.PRODUCTION) === -1 && isProduction) ||
          (pluginConfig.environments.indexOf(hooks.environments.DEVELOPMENT) === -1 && !isProduction)) {
        console.log(chalk.yellow(`Not loading universal-redux plugin '${pluginConfig.path}'`));
        return null;
      }
    }
    if (isServer) {
      require(pluginConfig.path);
    }
    console.log(chalk.green(`Loaded universal-redux plugin '${pluginConfig.path}'`));

    return pluginConfig.path;
  })
  .filter(pp => !!pp);
