import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ImageminWebpackPlugin from 'imagemin-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// import { HotModuleReplacementPlugin } from 'webpack';
import { resolve } from 'path';
import getContext from './config';
import * as nunjucksFilters from './views/filters';

module.exports = async (env = 'development') => ({
  mode: env,
  entry: {
    bundle: ['./client/index.js'],
  },
  resolve: {
    modules: ['node_modules', 'bower_components'],
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
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  browsers: 'defaults'
                },
              ],
            ],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/,
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
      {
        test: /\.(html|njk)$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href'],
              root: resolve(__dirname, 'client'),
            },
          },
          {
            loader: 'nunjucks-html-loader',
            options: {
              searchPaths: [resolve(__dirname, 'views')],
              filters: nunjucksFilters,
              context: await getContext(env),
            },
          },
        ],
      },
      {
        test: /\.scss/,
        use: [
          env === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: ['bower_components'],
            },
          }
        ],
      },
    ],
  },
  devServer: {
    hot: false, // Needed for live-reloading Nunjucks templates.
    allowedHosts: ['.ngrok.io', 'local.ft.com'],
  },
  devtool: 'source-map',
  plugins: [
    // new HotModuleReplacementPlugin(), // Re-enable if devServer.hot is set to true
    new MiniCssExtractPlugin({
      filename: env === 'production' ? '[name].[contenthash].css' : '[name].css',
    }),
    // instructions for generating multiple HTML files: https://github.com/jantimon/html-webpack-plugin#generating-multiple-html-files
    new HtmlWebpackPlugin({
      template: 'client/index.html',
    }),
    env === 'production'
      ? new ImageminWebpackPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
      : undefined,
  ].filter(i => i),
});
