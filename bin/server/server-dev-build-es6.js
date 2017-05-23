#!/usr/bin/env node

const webpack = require('webpack');
const webpackConfig = require('./../../config/webpack.server.config.js');

const compiler = webpack(webpackConfig);

compiler.plugin('compilation', () => {
  console.log('\nBuilding webpack server bundle...');
});

compiler.watch({}, (err, stats) => {
  if (err) {
    console.log('Webpack build had fatal error:', err);
    return;
  }

  const options = {
    hash: true,
    version: true,
    timings: true,
    assets: true,
    chunks: false,
    colors: true
  };

  console.log('Webpack server build was successful.');
  const jsonStats = stats.toJson();
  if (jsonStats.errors.length > 0) {
    options.errors = true;
  }
  if (jsonStats.warnings.length > 0) {
    options.warnings = true;
  }
  console.log(stats.toString(options));
});
