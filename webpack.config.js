const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './dist/src/Core.js',
  output: {
    filename: 'lalala.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'dist/src/'),
      'three': path.resolve(__dirname, 'dist/three/'),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
      },
      extractComments: false,
    })],
  },
};
