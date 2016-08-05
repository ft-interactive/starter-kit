/**
 * Starter Kit server app boilerplate
 *
 * This boilerplate does two things:
 *   - Provides a starting point for Heroku-based server webapps
 *   - Manages all of Starter Kit's build Tasks
 */

import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import convert from 'koa-convert';
import koaBS from 'koa-browser-sync';

import router from './routes';
import buildInitial from './tasks/build';
import { errMsg, infoMsg } from './shared';

// Build the initial contents of `dist/`
try {
  buildInitial();
} catch (e) {
  console.error(errMsg('Error during initial build:'));
  console.error(e);
}

const app = new Koa();
const port = process.env.PORT || 5555;

// Serve out of the contents of `dist/` as static
app.use(mount('/styles', serve('dist/styles')));
app.use(mount('/scripts', serve('dist/scripts')));

// Start BrowserSync if NODE_ENV is 'development'.
if (app.env === 'development') {
  console.info(infoMsg(' » Starting in development mode '));
  app.use(convert(koaBS({
    init: true,
    logLevel: 'silent',
    files: 'dist/**/*',

    // The following is from the Gulpfile
    notify: true,
    open: process.argv.includes('--open'),
    ui: process.argv.includes('--bsui'),
    ghostMode: process.argv.includes('--ghost'),
  })));
}

// Populate our routes...
app.use(router.routes());
app.use(router.allowedMethods());

// Hey! Listen! ✨
app.listen(port, () => {
  console.info(infoMsg(` » Starter Kit server running on port ${port} `));
});
