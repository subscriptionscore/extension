const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ZipPlugin = require('zip-webpack-plugin');
const manifest = require('./manifest.json');
const commonOptions = require('./webpack.config');
const baseManifest = require('./manifest.json');

const options = {
  mode: commonOptions.mode,
  optimization: {
    // We no not want to minimize our code.
    minimize: false
  },
  entry: commonOptions.entry,
  output: {
    path: path.join(__dirname, 'build/firefox'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: commonOptions.module.rules
  },
  resolve: {
    ...commonOptions.resolve,
    alias: {
      browser: path.resolve(__dirname, 'src/js/browser/firefox')
    }
  },
  plugins: [
    ...commonOptions.plugins,
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.firefox.json',
        to: 'manifest.json',
        transform: function(content) {
          const manifest = {
            ...baseManifest,
            ...JSON.parse(content.toString())
          };
          let name = manifest.name;
          let version_name = `v${manifest.version}`;
          if (commonOptions.isDevelopment) {
            name = `${name} Dev`;
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
    ]),
    ...(commonOptions.isDevelopment
      ? []
      : [
          new ZipPlugin({
            path: '../../releases',
            filename: `firefox-latest.zip`
          })
        ])
  ]
};

if (process.env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
