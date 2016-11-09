'use strict';

const webpack           = require('webpack');
const CleanPlugin       = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer      = require('autoprefixer');

const production = process.env.NODE_ENV === 'production';

const PATHS = {
  entry:   `${__dirname}/app/entry`, 
  output:  `${__dirname}/build`,
  context: `${__dirname}/app`,
};

let entry = {
  app: [
    // 'bootstrap-loader/extractStyles',
    PATHS.entry,
  ],
  vendor: [
    'angular',
  ],
};

let output = {
  path:     PATHS.output,
  filename: '[name].bundle.js',
};






let plugins = [
  new CleanPlugin('build'),
  new webpack.DefinePlugin({
    __DEVONLY__: production,
  }),
  new webpack.LoaderOptionsPlugin({
    debug: !production,
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
  new webpack.LoaderOptionsPlugin({
    test:  /\.scss$/,
    debug: !production, 
    options: {
      postcss: [
        autoprefixer({
          browsers: [
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24',
            'Explorer >= 8',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6',
          ],
        }),
      ],
      // sass: {
        // sourceMap: true,
      // },
      
      // Fix for 'Cannot resolve property path of undefined' b/c of sass loader
      // See https://github.com/jtangelder/sass-loader/issues/298
      output:  {
        path: PATHS.output,
      }, 
      context: PATHS.context,
    },
  }),
  // new ExtractTextPlugin({
  //   filename:  '[name].bundle.css', 
  //   allChunks: true, 
  // }),
  new HtmlWebpackPlugin({
    template: `${__dirname}/app/main/index.html`,
  }),
];

// Plugins for production code only 
if (production) {
  plugins = plugins.concat([
    new webpack.optimize.CommonsChunkPlugin({
      name:      'vendor',
      children:  true,
      minChunks: 2,
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false,
      },
    }), 
    new webpack.optimize.DedupePlugin(),
  ]);
}







let rules = [
  {
    test: /index\.js$/, 
    loader: {
      loader: 'baggage', 
      query: '[dir].scss',
    },
  }, 
  // EXAMPLE: preLoader equivalent for webpack 2 
  {
    test:    /\.js$/, 
    include: PATHS.context,
    
    // This is where pre / post is set. 
    enforce: 'pre',
    
    // This is the same as loader/loaders now 
    use: [
      {
        loader: 'eslint-loader',
        options: {
          failOnError:   true,
          failOnWarning: true, 
          emitError:     true, 
          emitWarning:   true, 
        },
      },
    ],
  },
  
  // EXAMPLE: normal loaders 
  {
    test:    /\.js$/, 
    include: PATHS.context,
    use: [
      {
        loader: 'babel',
      },
    ],
  },
  // {
  //   test:    /\.css$/, 
  //   // include: PATHS.context,
  //   
  //   // Must use property 'loader'--breaks with 'use' instead
  //   loader: ExtractTextPlugin.extract({
  //     loader:         { loader: 'css' },
  //     fallbackLoader: { loader: 'style' },
  //   }),
  // },
  // {
  //   test:    /\.scss$/, 
  //   // include: PATHS.context,
  //   loader: ExtractTextPlugin.extract({
  //     loader: [
  //       { loader: 'css' },
  //       { loader: 'postcss' }, 
  //       { loader: 'resolve-url' }, 
  //       { 
  //         loader: 'sass', 
  //         query: {
  //           sourceMap: true, 
  //         },
  //       },
  //     ], 
  //     fallbackLoader: { loader: 'style' },
  //   }),
  // },
  // dummy loader for no extract text 
  {
    test: /\.scss$/, 
    use: [
      { loader: 'style' },
      { loader: 'css' },
      { loader: 'postcss' }, 
      { loader: 'resolve-url' }, 
      { 
        loader: 'sass', 
        query: {
          sourceMap: true, 
        },
      },
    ], 
  },
  
  {
    test:    /\.(ttf|eot|svg|woff(2)?)(\?v=\d+\.\d+\.\d+)?$/,
    
    // Cannot have an include like PATHS.context because trying to load files from node_modules for fontawesome
    use: {
      loader: 'url', 
      query: {
        limit: 10000,
      },
    },
  }, 
];








let webpackModule = {
  rules,
};

let configuration = {
  context: PATHS.context,
  plugins,
  entry, 
  output, 
  module: webpackModule, 
  stats: {
    reasons:      true, 
    errorDetails: true, 
  },
};

module.exports = configuration;
