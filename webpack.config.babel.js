/**
 * @file
 * This is the Webpack config! It varies a bit between development and production,
 * specified via the `env` value (changeable via CLI flag).
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ImageminWebpackPlugin from 'imagemin-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { HotModuleReplacementPlugin, DefinePlugin } from 'webpack';
import { resolve } from 'path';
import getContext from './config';

const buildTime = new Date();

module.exports = async (env = 'development') => ({
  mode: env,
  entry: ['./client/index.js'],
  resolve: {
    modules: ['node_modules', 'bower_components'],
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[hash:8].js',
    sourceMapFilename: '[name].[hash:8].map',
    chunkFilename: '[id].[hash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.(txt|xml)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'raw-loader',
        },
      },
      {
        test: /\.(csv|tsv)$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  // Via: https://docs.google.com/document/d/1mByh6sT8zI4XRyPKqWVsC2jUfXHZvhshS5SlHErWjXU/view
                  targets: {
                    browsers: ['last 2 versions', 'ie >= 11', 'safari >= 10', 'ios >= 9'],
                  },
                },
              ],
              '@babel/preset-react',
            ],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images/',
              name: '[name]--[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]--[hash].[ext]',
            },
          },
          {
            loader: 'extract-loader',
          },
          { loader: 'css-loader', options: { sourceMap: true, url: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
        ],
      },
      // Critical path CSS used by server
      {
        test: /critical-path.scss/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].css',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: ['bower_components'],
            },
          },
        ],
      },
      // Remaining CSS
      {
        test: /client\/.+\.scss/,
        use: [
          MiniCssExtractPlugin.loader,
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
      },
    ],
  },
  devServer: {
    hot: true,
    allowedHosts: ['.ngrok.io', 'local.ft.com'],
  },
  devtool: 'source-map',
  plugins: [
    new HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: env === 'production' ? '[name].[contenthash].css' : '[name].css',
    }),
    // instructions for generating multiple HTML files: https://github.com/jantimon/html-webpack-plugin#generating-multiple-html-files
    new HtmlWebpackPlugin({
      template: './server/index.js',
      templateParameters: { ...(await getContext()), buildTime },
      filename: 'index.html',
    }),
    new DefinePlugin({
      'window.BUILD_TIME': JSON.stringify(buildTime.toISOString()),
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    env === 'production'
      ? new ImageminWebpackPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
      : undefined,
  ].filter(i => i),
});
