const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ENTRY = require('./entry.js');
const { deepmerge } = require('./utils');

// configure Resolve
const configureResolveAlias = () => {
  return {
    alias: {
      assets: path.resolve(__dirname, '../sources/images'),
    },
  };
};

// configure Babel Loader
const configureBabelLoader = () => {
  return {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
    },
  };
};

// configure Pug Loader
const configurePugLoader = () => {
  return {
    test: /\.pug$/,
    loader: 'pug-loader',
    options: {
      pretty: true,
      self: true,
    },
  };
};

module.exports = {
  entry: Object.keys(ENTRY.html).reduce((acc, key) => {
    acc[key] = ENTRY.html[key].entry
      ? ENTRY.html[key].entry
      : './sources/js/main.js';
    return acc;
  }, {}),
  resolve: configureResolveAlias(),
  module: {
    rules: [configureBabelLoader(), configurePugLoader()],
  },
  plugins: Object.keys(ENTRY.html).map(key => {
    const value = ENTRY.html[key];

    const mode =
      process.env.NODE_ENV === 'production' ? 'production' : 'development';

    // entry js file
    const chunks = [key];

    // destination html file
    const filename = value.html || key + '.html';

    // source template file
    const template = `./sources/templates/pages/${value.template || key}.pug`;

    // source data
    const data = {
      global: require(`../sources/data/global.json`),
      file: require(`../sources/data/pages/${value.data}`),
    };

    // special merge data
    if (value.data) {
      data.html = deepmerge.all([data.global, data.file]);
    }

    return new HtmlWebPackPlugin({
      mode,
      chunks,
      filename,
      template,
      ...data,
    });
  }),
};
