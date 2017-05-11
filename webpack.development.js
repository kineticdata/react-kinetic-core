/* eslint-disable */
var webpack = require('webpack');
var path = require('path');
var config = require('./config');
var DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
  entry: [
    'babel-polyfill',
    'isomorphic-fetch',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:'+config.localPort,
    'webpack/hot/only-dev-server',
    './src/examples/index.js',
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static'),
    publicPath: '/static/'
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new DashboardPlugin(),
  ],
  devServer: {
    host: 'localhost',
    port: config.localPort,
    hot: true,
    overlay: true
  },
};
