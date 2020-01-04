const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const commonOptions = require('./webpack.config');

const entrypoints = [
  {
    name: 'content',
    path: path.join(__dirname, 'src', 'js', 'content', 'index.js')
  },
  {
    name: 'popup',
    path: path.join(__dirname, 'src', 'js', 'popup', 'index.js')
  },
  {
    name: 'options',
    path: path.join(__dirname, 'src', 'js', 'options', 'index.js')
  },
  {
    name: 'background',
    path: path.join(__dirname, 'src', 'js', 'background', 'chrome', 'index.js')
  },
  {
    name: 'frame',
    path: path.join(__dirname, 'src', 'js', 'content', 'frame', 'index.js')
  }
];

const entry = entrypoints.reduce(
  (out, { name, path }) => ({
    ...out,
    [name]: ['babel-polyfill', path]
  }),
  {}
);

const options = {
  mode: commonOptions.mode,
  entry,
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
          const manifest = JSON.parse(content.toString());
          let name = manifest.name;
          let version_name = manifest.version_name;
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
    ])
  ]
};

if (process.env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
