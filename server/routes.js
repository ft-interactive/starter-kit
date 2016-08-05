/**
 * Server-side routes
 *
 * This file is used by the server to set up various application routes.
 */

import Router from 'koa-router';
import revManifest from 'koa-manifest-rev';
import { resolve } from 'path';

import buildHtml from './tasks/templates';
import devTasks from './tasks/dev';
import { errMsg } from './shared';

const routes = new Router();

routes.use(devTasks, revManifest({
  manifest: resolve(__dirname, '../', 'dist/', 'rev-manifest.json'),
}));

routes.get('/', async (ctx, next) => {
  await next();

  const filters = [
    {
      name: 'rev',
      func: ctx.state.manifest, // This comes from `koa-manifest-rev`.
    },
  ];

  try {
    ctx.body = await buildHtml(undefined, ...filters); // @TODO pass actual path to buildHtml.
  } catch (e) {
    console.error(errMsg('Error building HTML:'));
    console.error(e);
  }
});

export default routes;
