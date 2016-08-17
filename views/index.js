import nunjucks from 'nunjucks';
import markdownTag from 'nunjucks-markdown';

// Disabling because I don't know where this is used. Æ
// eslint-disable-next-line import/prefer-default-export
export function configure() {
  delete require.cache[require.resolve('./filters/index')];

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(['client', 'views'])
  );

  Object.assign(env.filters, require('./filters'));  // eslint-disable-line
  markdownTag.register(env, env.filters.md);
  env.globals.now = function now(unixtime) {
    return unixtime ? Date.now() : new Date();
  };
  env.globals.ctx = function ctx(property, outputJSON) {
    const value = typeof property === 'string' ? this.ctx[property] : this.ctx;
    const stringify = outputJSON || (typeof property === 'boolean' && property);
    return stringify ? env.filters.json(value) : value;
  };

  return env;
}
