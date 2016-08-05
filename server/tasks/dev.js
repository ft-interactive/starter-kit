/**
 * Development related tasks
 */

import { extname, resolve } from 'path';
import { watch } from 'chokidar';

import buildSass from './styles';
import buildScripts from './scripts';
import revAssets from './rev';
import { errMsg } from '../shared';

const distFiles = resolve(__dirname, '../../client/**/*');

// Watch for JS or Sass changes in client/ while in dev mode
if (process.env.NODE_ENV === 'development') {
  watch(distFiles).on('all', async (evt, path) => {
    switch (extname(path)) {
      case '.scss':
        try {
          await buildSass(path);
        } catch (e) {
          console.error(errMsg('Error generating styles:'));
          console.error(e);
        }
        break;

      case '.js':
        try {
          await buildScripts(path);
        } catch (e) {
          console.error(errMsg('Error building bundle:'));
          console.error(e);
        }
        break;

      default:
        break;
    }

    revAssets(path); // @TODO add a single asset fork to tasks/rev.js
  });
}


export default async function devTasks(ctx, next) {
  await next(); // Wait for the other middleware to finish before continuing...

  // If in development mode, rev all assets on every page load
  // @TODO Is this excessive? This is probably excessive...
  // @ACTUALLY, this block can probably be removed once revAssets takes individual paths
  if (process.env.NODE_ENV === 'development') {
    try {
      revAssets(null, true);
    } catch (e) {
      console.error(errMsg('Error revving assets:'));
      console.error(e);
    }
  }
}
