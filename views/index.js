import nunjucks from 'nunjucks';
import markdown_tag from 'nunjucks-markdown';
import markdownIt from 'markdown-it';

export function configure() {

  delete require.cache[require.resolve('./filters/index')];

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(['client', 'views'])
  );

  Object.assign(env.filters, require('./filters'));
  markdown_tag.register(env, env.filters.md);

  return env;
}
