const webpack = require('webpack');
const path = require('path');

const Dotenv = require('dotenv-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

const fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2'
];

const prodPlugins = [
  // clean the build folder
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['**/*']
  })
];

const entrypoints = [
  {
    name: 'onload',
    path: path.join(__dirname, 'src', 'js', 'content', 'onload.js')
  },
  {
    name: 'frame',
    path: path.join(__dirname, 'src', 'js', 'content', 'frame', 'index.js')
  },
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
    path: path.join(__dirname, 'src', 'js', 'background', 'index.js')
  },
  {
    name: 'gmail',
    path: path.join(__dirname, 'src', 'js', 'content', 'gmail', 'index.js')
  }
];

const entry = entrypoints.reduce(
  (out, { name, path }) => ({
    ...out,
    [name]: name.startsWith('gmail') ? [path] : ['babel-polyfill', path]
  }),
  {}
);

module.exports = {
  isDevelopment: isDevelopment,
  entry,
  mode: process.env.NODE_ENV || 'development',
  devtool:
    process.env.NODE_ENV === 'production' ? null : 'cheap-module-source-map',
  optimization: {
    minimize: false
  },
  node: {
    global: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        exclude: /node_modules/
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: 'file-loader?name=[name].[ext]',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/
      },
      {
        test: /\.module\.s[ac]ss$/,
        loader: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              localsConvention: 'camelCase',
              modules: {
                localIdentName: `[name]__[local]___[hash:base64:5]`
              },
              sourceMap: !!isDevelopment
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !!isDevelopment
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/,
        exclude: /\.module.(s[ac]ss)$/,
        loader: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !!isDevelopment
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  },
  copyFiles: [
    {
      from: 'assets',
      to: 'assets'
    }
  ],
  plugins: [
    ...(isDevelopment ? [] : prodPlugins),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.GRAPHQL_URL': JSON.stringify(process.env.GRAPHQL_URL),
      'process.env.REFERRAL_URL': JSON.stringify(process.env.REFERRAL_URL)
    }),
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'options.html'),
      filename: 'options.html',
      chunks: ['options']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'background.html'),
      filename: 'background.html',
      chunks: ['background']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'frame.html'),
      filename: 'frame.html',
      chunks: ['frame']
    }),
    new WriteFilePlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].bundle.css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].bundle.css'
    }),
    // Placeholder for global used in any node_modules
    new webpack.DefinePlugin({
      global: 'window'
    })
  ]
};
