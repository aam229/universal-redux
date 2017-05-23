const fs = require('fs');

module.exports = function IsomorphicClientPlugin(options) {
  this.outputPath = options.output;
  this.publicPath = options.publicPath;
};

module.exports.prototype.apply = function apply(compiler) {
  compiler.plugin('compile', () => {
    if (fs.existsSync(this.outputPath)) {
      fs.unlinkSync(this.outputPath);
    }
  });
  compiler.plugin('emit', (curCompiler, callback) => {
    const stats = curCompiler.getStats().toJson();
    const assets = Object.keys(stats.assetsByChunkName)
      .map(key => stats.assetsByChunkName[key])
      .reduce((reducedAssets, namedAssets) => reducedAssets.concat(namedAssets), []);

    const baseOutput = {
      javascript: [],
      styles: [],
      others: [],
      publicPath: this.publicPath
    };
    const output = assets.reduce((out, file) => {
      if (file.endsWith('.js')) {
        out.javascript.push(file);
      } else if (file.endsWith('.css')) {
        out.styles.push(file);
      } else {
        out.others.push(file);
      }
      return out;
    }, baseOutput);
    fs.writeFileSync(this.outputPath, JSON.stringify(output, null, 2));
    callback();
  });
};
