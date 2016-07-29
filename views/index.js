import nunjucks from 'nunjucks';
import markdownTag from 'nunjucks-markdown';
// import markdownIt from 'markdown-it';

// Disabling because I don't know where this is used. Æ
// eslint-disable-next-line import/prefer-default-export
export function configure() {
  delete require.cache[require.resolve('./filters/index')];

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(['client', 'views'])
  );

  Object.assign(env.filters, require('./filters'));
  markdownTag.register(env, env.filters.md);

  return env;
}
