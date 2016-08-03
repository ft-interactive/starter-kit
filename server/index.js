/**
 * Starter Kit server app boilerplate
 *
 * This boilerplate does two things:
 *   - Provides a starting point for Heroku-based server webapps
 *   - (Eventually might) manage all of Starter Kit's build Tasks
 */

import Koa from 'koa';
import convert from 'koa-convert';
import koaBS from 'koa-browser-sync'; // Optional alternative: https://www.npmjs.com/package/koa-liveload
import serve from 'koa-static';
import chalk from 'chalk';

const app = new Koa();
const port = process.env.PORT || 5555;

const msg = chalk.white.bgBlue;

if (app.env === 'development') {
  console.info(msg(' » Starting in development mode '));

  // Run the Gulp watch task without BrowerSync
  const gulp = require('gulp');
  require('../gulpfile.babel');
  if (gulp.tasks.watch) {
    gulp.start(['watch-server']); // This will be depreciated in Gulp 4
  }

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

app.use(convert(serve('dist/')));

app.listen(port, () => {
  console.info(msg(` » Starter Kit server running on port ${port} `));
});
