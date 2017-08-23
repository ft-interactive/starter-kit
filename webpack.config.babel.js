import 'babel-polyfill';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ImageminWebpackPlugin from 'imagemin-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import getContext from './config';
import { HotModuleReplacementPlugin } from 'webpack';
import { resolve, extname } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import * as nunjucksFilters from './views/filters';

module.exports = async (env = 'development') => ({
  entry: {
    bundle: ['babel-polyfill', './client/index.js'],
  },
  resolve: {
    modules: ['node_modules', 'bower_components', resolve(__dirname, 'client')],
  },
  output: {
    filename: env === 'production' ? '[name].[hash].js' : '[name].js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(txt|csv|tsv|xml)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'raw-loader',
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  // Via: https://docs.google.com/document/d/1mByh6sT8zI4XRyPKqWVsC2jUfXHZvhshS5SlHErWjXU/view
                  browsers: ['last 2 versions', 'ie >= 11', 'safari >= 10', 'ios >= 9'],
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(html|njk)$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'nunjucks-html-loader',
            options: {
              searchPaths: [
                resolve(__dirname, 'views'),
              ],
              filters: nunjucksFilters,
              context: await getContext(),
            }
          },
        ]
      },
      {
        test: /\.s?css/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: ['bower_components'],
              },
            },
          ],
          fallback: 'style-loader',
        }),
      },
    ],
  },
  devServer: {
    hot: false,
    // contentBase: resolve(__dirname, 'client'),
  },
  devtool: 'source-map',
  plugins: [
    new HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: env === 'production' ? '[name].[contenthash].css' : '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: 'client/index.html',
    }),
    new CopyWebpackPlugin(
      [
        { from: 'client/components/core/top.css', to: 'top.css' },
        { from: 'client/images/*.+(jpg|jpeg|svg|png|gif)', to: 'images/', flatten: true },
      ],
      {
        copyUnmodified: true,
      },
    ),
    env === 'production'
      ? new ImageminWebpackPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
      : undefined,
    function revReplace() {
      this.plugin('done', (stats) => {
        if (env !== 'production') return; // Only rev in prod

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
  ].filter(i => i),
});
