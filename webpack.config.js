'use strict';

const webpack     = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const autoprefixer      = require('autoprefixer');

const production = process.env.NODE_ENV === 'production';

const PATHS = {
  entry: `${__dirname}/app/entry`, 
  build: `${__dirname}/build`,
};

let entry = {
  app: [
    PATHS.entry,
  ],
  // vendor: [
  //   'angular',
  // ],
};

let output = {
  path:     PATHS.build,
  filename: '[name].bundle.js',
};

let plugins = [
  new CleanPlugin('build'),
  // new webpack.DefinePlugin({
  //   __DEVONLY__: production,
  // }),
  // new webpack.LoaderOptionsPlugin({
  //   debug: true,
  //   options: {
  //     devSever: {
  //       devtool:            'eval-source-map', 
  //       contentBase:        PATHS.build, 
  //       historyApiFallback: true, 
  //       progress:           true, 
  //       stats:              'errors-only',
  //     },
  //   },
  // }),
  new ExtractTextPlugin({
    filename:  '[name].bundle.css', 
    allChunks: true, 
  }),
  new HtmlWebpackPlugin({
    template: `${__dirname}/app/main/index.html`,
  }),
];


let rules = [
  
  // EXAMPLE: preLoader equivalent for webpack 2 
  // {
  //   test:    /\.js$/, 
  //   include: `${__dirname}/app`,
  //   // This is where pre / post is set. 
  //   enforce: 'pre',
  //   
  //   // This is the same as loader/loaders now 
  //   use: [
  //     {
  //       loader: 'eslint-loader',
  //       options: {
  //         failOnError:   true,
  //         failOnWarning: true, 
  //         emitError:     true, 
  //         emitWarning:   true, 
  //       },
  //     },
  //   ],
  // },
  
  // EXAMPLE: normal loaders 
  {
    test:    /\.js$/, 
    include: `${__dirname}/app`,
    use: [
      {
        loader: 'babel',
      },
    ],
  },
  {
    test:    /\.css$/, 
    include: `${__dirname}/app`,
    use: ExtractTextPlugin.extract({
      loader:         'css-loader', 
      fallbackLoader: 'style-loader',
    }),
  },
];

let webpackModule = {
  rules,
};

module.exports = {
  context: `${__dirname}/app`,
  plugins,
  entry, 
  output, 
  module: webpackModule, 
  stats: {
    reasons:      true, 
    errorDetails: true, 
  },
};
