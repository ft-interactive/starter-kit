import 'babel-polyfill';
import NunjucksWebpackPlugin from 'nunjucks-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
// import ManifestPlugin from 'webpack-manifest-plugin';
import { resolve, extname } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { configure as configureNunjucks } from './views';
import getContext from './config';

const env = configureNunjucks();

module.exports = async () => ({
  entry: {
    bundle: './client/index.js',
  },
  resolve: {
    modules: ['node_modules', 'bower_components'],
  },
  output: {
    filename: '[name].[hash].js',
    path: resolve(__dirname, 'dist'),
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
    // new ManifestPlugin(),
    new NunjucksWebpackPlugin({
      template: [{
        from: resolve(__dirname, 'client/index.html'),
        to: resolve(__dirname, 'dist/index.html'),
        context: await getContext(),
      }],
      context: {},
      environment: env,
    }),
    new CopyWebpackPlugin([
      { from: 'client/components/core/top.css', to: 'top.css' },
    ], {
      copyUnmodified: true,
    }),
    function revReplace() {
      this.plugin('done', (stats) => {
        const items = stats.toJson().assetsByChunkName.bundle.reduce((col, item) => {
          if (extname(item) === '.map') return col;
          col[`bundle${extname(item)}`] = item; // eslint-disable-line
          return col;
        }, {});
        let html = readFileSync(resolve(__dirname, 'dist', 'index.html'), { encoding: 'utf-8' });
        Object.entries(items).forEach(([orig, rev]) => {
          html = html.replace(new RegExp(orig, 'g'), rev);
        });
        writeFileSync(resolve(__dirname, 'dist', 'index.html'), html, { encoding: 'utf-8' });
      });
    },
  ],
});
