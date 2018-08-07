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
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  ],
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  }
};
