#!/usr/bin/env node
const chalk = require('chalk');
const Express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

const appConfig = require('./../../config/app.config.js');
const webpackConfig = require('./../../config/webpack.client.config.js');

const compiler = webpack(webpackConfig);
const host = appConfig.webpackserver.host;
const port = appConfig.webpackserver.port;

const serverOptions = {
  contentBase: `http://${host}:${port}`,
  quiet: false,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: {
    hash: true,
    version: true,
    timings: true,
    assets: true,
    chunks: false,
    colors: true,
    errors: true,
    warnings: true
  }
};

const app = new Express();
const middleware = webpackMiddleware(compiler, serverOptions);


app.use(middleware);
app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(chalk.yellow(`==> 🚧  Webpack client server listening on port ${port}`));
  }
});
