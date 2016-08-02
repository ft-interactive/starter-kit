/**
 * FT Interactive Graphics :: linting rules
 *
 * These are provided as sensible defaults that only warn by default.
 * Some more important ones we've cranked up to the "error" level.
 */

'use strict';

const rules = Object.assign({},
  require('eslint-config-airbnb-base/rules/es6').rules,
  require('eslint-config-airbnb-base/rules/best-practices').rules,
  require('eslint-config-airbnb-base/rules/style').rules,
  require('eslint-config-airbnb-base/rules/errors').rules,
  require('eslint-config-airbnb-base/rules/variables').rules
);

const config = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: ['babel'],
  rules: Object.keys(rules).reduce((last, curr) => {
    let rule = rules[curr];
    if (Array.isArray(rule) && (rule[0] === 2 || rule[0] === 'error')) {
      rule[0] = 1;
    } else if (rule === 2 || rule === 'error') {
      rule = 1;
    }

    last[curr] = rule;

    return last;
  }, {})
};

/**
 * Set overrides here for various rules
 */
const overrides = {
  'no-console': 0,
  'generator-star-spacing': 0,
  'babel/generator-star-spacing': [2, { before: false, after: true }],
  'global-require': 1,
  'import/no-extraneous-dependencies': 2
};

Object.assign(config.rules, overrides);
module.exports = config;
