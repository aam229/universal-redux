#!/usr/bin/env node

const MemoryFS = require('memory-fs');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const analyzer = require('webpack-bundle-size-analyzer');
const appConfig = require('./../../config/app.config.js');

const webpackConfig = require(`./../../config/webpack.${process.env.JS_ENV}.dll-analyze.config`);

const dependencySizeTree = analyzer.dependencySizeTree;
const printDependencySizeTree = analyzer.printDependencySizeTree;
const loaderRegex = /.*!/;

function getModulePath(identifier) {
  return identifier.replace(loaderRegex, '');
}

function getModulePackage(modulePath) {
  const packages = modulePath.split(new RegExp(`\\${path.sep}node_modules\\${path.sep}`));
  if (packages.length > 1) {
    const lastSegment = packages.pop();
    if (lastSegment[0] === ('@')) {
      // package is a scoped package
      const offset = lastSegment.indexOf(path.sep) + 1;
      packages.push(lastSegment.slice(0, offset + lastSegment.slice(offset).indexOf(path.sep)));
    } else {
      packages.push(lastSegment.slice(0, lastSegment.indexOf(path.sep)));
    }
  }
  packages.shift();
  return packages.length > 0 ? packages.shift() : null;
}

console.log('\nAnalyzing dependencies...');

const compiler = webpack(webpackConfig);
compiler.outputFileSystem = new MemoryFS();
compiler.run((err, stats) => {
  if (err) {
    console.log('Webpack build had fatal error:', err);
    return;
  }
  console.log(chalk.green.bold('\nDLL results:'));

  const jsonStats = stats.toJson();
  dependencySizeTree(jsonStats)
    .forEach(tree => printDependencySizeTree(tree, true, 0));

  const ignoreModules = new Set(appConfig.dll.ignore);
  const moduleFiles = jsonStats.modules.map(module => getModulePath(module.identifier))
    .filter(module => !module.startsWith('ignored'))
    .filter((module) => {
      const packageName = getModulePackage(module);
      return !ignoreModules.has(packageName) && packageName !== 'universal-redux' && packageName !== null;
    })
    .reduce((s, module) => s.add(module), new Set());

  const outputPath = path.resolve(appConfig.dll.root, appConfig.dll[process.env.JS_ENV]);
  fs.writeFileSync(outputPath, JSON.stringify(Array.from(moduleFiles), null, 2), 'utf8');
});
