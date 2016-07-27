/**
 * Starter Kit Nunjucks config
 *
 * This pulls in templates and filters from ft-interactive/ig-article and
 * then adds any extra ones added to views/ and views/filters, respectively.
 */

import { templates } from 'ig-article/lib';

export function configure() {
  delete require.cache[require.resolve('./filters/index')];

  const env = templates.configure(['client', 'views']);

  Object.assign(env.filters, require('./filters'));

  return env;
}
