const { getVVCRoot } = require('../app/util/isVVCInstalled');

const vvcRoot = getVVCRoot();

module.exports = {
  stories: [
    '../app/components/**/*.stories.mdx',
    '../app/components/**/*.stories.@(js|jsx|ts|tsx)',
    '../node_modules/@financial-times/g-components/src/**/*.stories.@(js|mdx)',
    vvcRoot && `${vvcRoot}/**/*.stories.@(js|mdx)`,
  ].filter(i => i),
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  babel: config => {
    config.presets.push(require.resolve('@emotion/babel-preset-css-prop'));
    return config;
  },
  webpackFinal: async (config, { configType }) => {
    // Transpile dependencies from @financial-times scope
    config.module.rules[0].exclude = /node_modules\/(?!@financial-times)/;

    // Add Sass support
    config.module.rules.push({
      test: /\.scss$/,
      resolve: {
        extensions: ['.scss', '.sass'],
      },
      use: [
        'style-loader',
        { loader: 'css-loader', options: { sourceMap: true } },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: ['node_modules', 'node_modules/@financial-times'],
          },
        },
      ],
    });

    return config;
  },
};
