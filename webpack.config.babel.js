/**
 * @file
 * This is the Webpack config! It varies a bit between development and production,
 * specified via the `env` value (changeable via CLI flag).
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ImageminWebpackPlugin from 'imagemin-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { HotModuleReplacementPlugin, DefinePlugin } from 'webpack';
import GenerateJsonPlugin from 'generate-json-webpack-plugin';
import { resolve, dirname } from 'path';
import getContext from './config';
import { getVVCRoot } from './app/util/isVVCInstalled';

const buildTime = new Date();

module.exports = async (env = 'development') => {
  const initialState = { ...(await getContext(env)), buildTime };
  const IS_DEV = env === 'development';
  const vvcRoot = getVVCRoot();

  return {
    mode: env,
    entry: ['react-hot-loader/patch', './app/index.js'],
    resolve: {
      alias: {
        '@financial-times/g-components': resolve(
          dirname(require.resolve('@financial-times/g-components/package.json')),
          'build'
        ),
        '@financial-times/vvc': vvcRoot || '',
      },
    },
    output: {
      path: resolve(__dirname, 'dist'),
      filename: IS_DEV ? '[name].js' : '[name].[hash:8].js',
      sourceMapFilename: IS_DEV ? '[name].map' : '[name].[hash:8].map',
      chunkFilename: IS_DEV ? '[id].js' : '[id].[hash:8].js',
    },
    module: {
      rules: [
        {
          test: /\.(txt|xml)$/,
          exclude: /(node_modules)/,
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
          test: /\.jsx?$/,
          exclude: /node_modules\/(?!@financial-times)/,
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
                '@emotion/babel-preset-css-prop',
              ],
              plugins: ['react-hot-loader/babel', '@babel/plugin-syntax-dynamic-import'],
            },
          },
        },
        {
          test: /\.(png|jpe?g|psd|pdf|gif|webp|mov|mp4|wmv|avi|mkv|webm|mp3|ogg|svg)$/,
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
              loader: IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
              options: {
                hmr: IS_DEV,
              },
            },
            { loader: 'css-loader', options: { sourceMap: true, url: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
          ],
        },
        {
          test: /\.scss$/,
          resolve: {
            extensions: ['.scss', '.sass'],
          },
          use: [
            {
              loader: IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
              options: {
                hmr: IS_DEV,
              },
            },
            { loader: 'css-loader', options: { sourceMap: true } },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: ['node_modules', 'node_modules/@financial-times'],
              },
            },
          ],
        },
      ],
    },
    devServer: {
      hot: true,
      allowedHosts: ['.ngrok.io', 'local.ft.com', 'bs-local.com'],
    },
    devtool: IS_DEV ? 'inline-source-map' : 'source-map',
    plugins: [
      new HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        filename: IS_DEV ? '[name].css' : '[name].[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        title: initialState.title || initialState.headline,
        template: './app/index.html',
        context: {
          ...initialState,
          pageClasses: `core${initialState.flags.dark ? ' dark' : ''}`,
        },
      }),
      new GenerateJsonPlugin('context.json', initialState),
      new DefinePlugin({
        'window.BUILD_TIME': JSON.stringify(buildTime.toISOString()),
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      IS_DEV ? undefined : new ImageminWebpackPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    ].filter((i) => i),
  };
};
