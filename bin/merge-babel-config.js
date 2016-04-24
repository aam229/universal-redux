const fs = require('fs');
const path = require('path');
const util = require('util');

function loadAndParse(filePath) {
  const file = fs.readFileSync(filePath);
  return JSON.parse(file);
}

module.exports = (userBabelConfig, verbose) => {
  const baseBabelConfig = loadAndParse(path.resolve(__dirname, '..', './.babelrc'));
  const babelConfig = userBabelConfig ? Object.assign(baseBabelConfig, loadAndParse(path.resolve(userBabelConfig))) : baseBabelConfig;

  const hmrConfig = [
    require.resolve('babel-plugin-react-transform'), {
      transforms: [
        {
          transform: require.resolve('react-transform-hmr'),
          imports: [ require.resolve(path.join(process.cwd(), 'node_modules', 'react')) ],
          locals: [ require.resolve('module') ]
        },
        {
          transform: require.resolve('react-transform-catch-errors'),
          imports: [ require.resolve(path.join(process.cwd(), 'node_modules', 'react')), require.resolve('redbox-react') ]
        }
      ]
    }
  ];
  babelConfig.plugins = babelConfig.plugins.map((pluginConfig) => {
    pluginConfig[0] = require.resolve("babel-plugin-" + pluginConfig[0]);
    return pluginConfig;
  });
  babelConfig.presets = babelConfig.presets.map((preset) => {
    return require.resolve("babel-preset-" + preset);
  });
  babelConfig.env.development.plugins.unshift(hmrConfig);
  babelConfig.cacheDirectory = true;

  const babelLoader = 'babel-loader?' + JSON.stringify(babelConfig);
  const jsLoaders = [ babelLoader ];

  // output configuration files if user wants verbosity
  if (verbose) {
    const utilOptions = {
      depth: 10,
      colors: true
    };

    console.log('\nBabel config:');
    console.log(util.inspect(babelConfig, utilOptions));
  }

  return jsLoaders;
};
