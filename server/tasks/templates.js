/**
 * Markup rendering-related tasks
 *
 * This renders a Nunjucks template, then inlines assets, then minifies the whole shebang.
 */


import promisify from 'es6-promisify';
import min from 'htmlmin';
import { resolve, basename } from 'path';
import { writeFile } from 'sander';

import { configure } from '../../views';
import { inline } from '../shared';
import data from '../../config/article'; // I'm not sure if this will work due to `require` caching.

const defaultPath = resolve(__dirname, '../..', 'client/index.html');

/**
 * Render a template using Nunjucks.
 * Returns the rendered template to Koa and writes it to `dist/.`
 *
 * @param  {String} path  Absolute path of file to render
 * @return {Promise<string>}  Rendered version of Nunjucks template.
 */
export default async function (path = defaultPath, ...filters) {
  const outPath = resolve(__dirname, `../../dist/${basename(path)}`);
  const env = configure();
  const render = promisify(env.render, env);

  filters.forEach(filter => env.addFilter(filter.name, filter.func));

  try {
    // Render from Nunjucks...
    const html = await render(path, data());

    // Inline stuff...
    const inlined = await inline(html, { rootpath: resolve(__dirname, '../../dist') });

    // Compress it...
    const compressed = min(inlined);

    // Write it to disk...
    await writeFile(outPath, compressed);

    // Return compressed version to middleware
    return compressed;
  } catch (e) {
    return e;
  }
}
