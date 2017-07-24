import 'babel-polyfill';
import NunjucksWebpackPlugin from 'nunjucks-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as path from 'path';
import { configure as configureNunjucks } from './views';
import getContext from './config';

const env = configureNunjucks();

module.exports = async () => ([{
  entry: {
    bundle: './client/index.js',
  },
  resolve: {
    modules: ['node_modules', 'bower_components'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(html|njk)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'nunjucks-loader',
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new NunjucksWebpackPlugin({
      template: [{
        from: path.resolve(__dirname, 'client/index.html'),
        to: path.resolve(__dirname, 'dist/index.html'),
      }],
      context: await getContext(),
      environment: env,
    }),
  ],
},
{
  entry: {
    styles: './client/styles.scss',
  },
  output: {
    filename: '.styles.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    modules: [path.resolve(__dirname, 'bower_components'), 'node_modules'],
    extensions: ['.scss', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.s?css/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [
                  'bower_components',
                ],
              } },
          ],
          fallback: 'style-loader',
        }),
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      disable: process.env.NODE_ENV === 'development',
    }),
  ],
}]);
