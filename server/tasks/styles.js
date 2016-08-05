/**
 * Sass and styles-related tasks
 */

import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import { resolve, basename } from 'path';
import { writeFile } from 'sander';

import { sassRender } from '../shared';

const AUTOPREFIXER_BROWSERS = [
  'ie >= 8',
  'ff >= 30',
  'chrome >= 34',
  'iOS >= 7',
  'Safari >= 7',
];
const prefixer = postcss([autoprefixer({ browsers: AUTOPREFIXER_BROWSERS })]);

export default async function (path = resolve(__dirname, '../../client/styles/main.scss')) {
  const outPath = resolve(__dirname, `../../dist/styles/${basename(path, '.scss')}.css`);

  try {
    // First generate the CSS from Sass...
    const compiledSass = await sassRender({
      file: path,
      outFile: outPath,
      outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded',
      includePaths: [resolve(__dirname, '../../bower_components')],
    });

    // Next run autoprefixer...
    const processed = await prefixer.process(compiledSass.css.toString());

    return writeFile(undefined, outPath, processed); // sander's writeFile's first arg is basePath
  } catch (e) {
    return e;
  }
}
