/**
 * JavaScript compilation-related tasks
 *
 * @NOTE debowerify currently depends on PR#85. Once merged, revert to parent package.
 */

import browserify from 'browserify';
import { resolve, basename } from 'path';
import { writeFile } from 'sander';
import promisify from 'es6-promisify';

const BROWSERIFY_TRANSFORMS = [
  'babelify',
  'debowerify',
];

/**
 * Bundle scripts using Browserify.
 * @param  {String}  path  Absolute path of entry point
 * @return {Promise<Buffer>}  Buffer of bundled output.
 */
export default async function (path = resolve(__dirname, '../..', 'client/scripts/main.js')) {
  const b = browserify(path, { cache: {}, packageCache: {} });
  const bundle = promisify(b.bundle, b);
  const outPath = resolve(__dirname, `../../dist/scripts/${basename(path)}`);

  BROWSERIFY_TRANSFORMS.forEach(transform => b.transform(transform));

  try {
    const result = await bundle();
    await writeFile(outPath, result.toString());

    return result;
  } catch (e) {
    return e;
  }
}
