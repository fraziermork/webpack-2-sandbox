'use strict';

const webpack     = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const autoprefixer      = require('autoprefixer');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

const PATHS = {
  entry: `${__dirname}/app/entry`, 
  build: `${__dirname}/build`,
};

let entry = {
  app: [
    PATHS.entry,
  ],
  vendor: [
    'angular',
  ],
};

let output = {
  path:     PATHS.build,
  filename: '[name].bundle.js',
};

let plugins = [
  new CleanPlugin('build'),
  new webpack.DefinePlugin({
    __DEVONLY__: production,
  }),
  new webpack.LoaderOptionsPlugin({
    debug: true,
    options: {
      devSever: {
        devtool:            'eval-source-map', 
        contentBase:        PATHS.build, 
        historyApiFallback: true, 
        progress:           true, 
        stats:              'errors-only',
      },
    },
  }),
  new HtmlWebpackPlugin({
    template: `${__dirname}/app/main/index.html`,
  }),
];

let loaders = [
  {
    test:    /\.js/, 
    loader:  'babel', 
    include: './app',
  },
];

let webpackModule = {
  loaders, 
};

module.exports = {
  // context: `${__dirname}/app`,
  plugins,
  entry, 
  output, 
  module: webpackModule, 
  stats: {
    reasons:      true, 
    errorDetails: true, 
  },
};
