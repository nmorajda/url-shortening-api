const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const OUTPUT_DIR = 'docs';

// configure Ouyput
const configureOutput = () => {
  return {
    path: path.resolve(__dirname, `../${OUTPUT_DIR}`),
    filename: 'vendor/js/[name].[hash].js',
    chunkFilename: 'vendor/js/[name].[hash].js',
  };
};

// configure File Loader
const configureFileLoader = () => {
  return {
    test: /\.(jpe?g|png|gif|svg|webp)$/i,
    loader: 'file-loader',
    options: {
      name: '[path][name].[ext]',
      outputPath: (url, resourcePath, context) => {
        if (/sources/.test(url)) {
          return url.replace('sources', '../..');
        }
      },
    },
  };
};

// configure Optimization
const configureOptimization = () => {
  return {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        styles: {
          name: 'styles',
          test: /\.s?css$/,
          chunks: 'all',
          minChunks: 2,
          enforce: true,
        },
      },
    },
    minimizer: [new TerserPlugin()],
  };
};

// configure MiniCssExtract
const configureMiniCssExtract = () => {
  return {
    filename: 'vendor/css/[name].[hash].css',
    chunkFilename: 'vendor/css/[name].[hash].css',
  };
};

// configure SW
const configureSW = () => {
  return {
    swDest: 'sw.js',
    clientsClaim: true,
    skipWaiting: true,
  };
};

// configure Copy
const configureCopy = () => {
  return [
    { from: 'sources/images/favicon.ico', to: './' },
    { from: 'sources/assets/', to: 'assets/' },
    { from: 'sources/images/', to: 'images/' },
    { from: 'sources/media/', to: 'media/' },
    { from: 'sources/php/', to: 'php/' },
    { from: 'sources/.htaccess', to: './' },
    { from: 'sources/robots.txt', to: './' },
    { from: 'sources/sitemap.xml', to: './' },
  ];
};

module.exports = merge(baseConfig, {
  mode: 'production',
  output: configureOutput(),
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: './config/',
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: ['./sources/scss/_config/_all.scss'],
            },
          },
        ],
      },
      configureFileLoader(),
    ],
  },
  optimization: configureOptimization(),
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      verbose: true,
    }),
    new MiniCssExtractPlugin(configureMiniCssExtract()),
    new WorkboxPlugin.GenerateSW(configureSW()),
    new CopyWebpackPlugin(configureCopy()),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: true,
    }),
  ],
});
