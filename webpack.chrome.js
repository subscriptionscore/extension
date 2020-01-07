const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseManifest = require('./manifest.json');
const commonOptions = require('./webpack.config');

const options = {
  mode: commonOptions.mode,
  entry: commonOptions.entry,
  output: {
    path: path.join(__dirname, 'build/chrome'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: commonOptions.module.rules
  },
  resolve: {
    ...commonOptions.resolve,
    alias: {
      browser: path.resolve(__dirname, 'src/js/browser/chrome')
    }
  },
  plugins: [
    ...commonOptions.plugins,
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.chrome.json',
        transform: function(content) {
          const manifest = {
            ...baseManifest,
            ...JSON.parse(content.toString())
          };
          let name = manifest.name;
          let version_name = `v${manifest.version}`;
          if (commonOptions.isDevelopment) {
            name = `${name} Dev`;
            version_name = `${version_name} - Development`;
          }
          // generates the manifest file using the package.json informations
          return Buffer.from(
            JSON.stringify({
              ...manifest,
              name,
              version_name
            })
          );
        }
      },
      {
        from: 'assets',
        to: 'assets'
      }
    ])
  ]
};

if (process.env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
