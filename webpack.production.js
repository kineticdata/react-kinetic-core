/* eslint-disable */
var webpack = require('webpack');
var path = require('path');
var config = require('./config');

module.exports = {
  entry: [
    './src/index.js',
  ],
  devtool: 'source-map',
  output: {
    filename: 'react-kinetic-core.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/static/',
    library: 'react-kinetic-core',
    libraryTarget: 'amd'
  },
  plugins: []
};
