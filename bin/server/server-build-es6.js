#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const appConfig = require('./../../config/app.config.js');
const webpackConfig = require('./../../config/webpack.server.config.js');

console.log('\nBuilding webpack server bundle...');
webpack(webpackConfig, (err, stats) => {
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

  if (appConfig.profile) {
    fs.writeFileSync(path.resolve(appConfig.webpackassets, 'server-profile.json'), JSON.stringify(jsonStats), 'utf8');
  }
});
