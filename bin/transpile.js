//  enable runtime transpilation to use ES6/7 in node

/* eslint-disable */
var fs = require('fs');
var path = require('path');

var babelrc = fs.readFileSync(path.resolve(__dirname, '../.babelrc'));
var config;

try {
  config = JSON.parse(babelrc);
  config.plugins = config.plugins.map((pluginConfig) => {
    pluginConfig[0] = require.resolve("babel-plugin-" + pluginConfig[0]);
    return pluginConfig;
  });
  config.presets = config.presets.map((preset) => {
    return require.resolve("babel-preset-" + preset);
  });

} catch (err) {
  console.error('==>     ERROR: Error parsing your babelrc');
  console.error(err);
}
/* eslint-enable */

require('babel-core/register')(config);
