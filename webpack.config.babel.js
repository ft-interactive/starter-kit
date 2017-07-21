import 'babel-polyfill';
import NunjucksWebpackPlugin from 'nunjucks-webpack-plugin';
import * as path from 'path';
import { configure as configureNunjucks } from './views';
import getContext from './config';

const env = configureNunjucks();

module.exports = async () => ({
  entry: './client/index.js',
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
      {
        test: /\.s?css/,
        use: [
            { loader: 'style-loader', options: { sourceMap: true } },
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },
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
});
