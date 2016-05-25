/* eslint-disable no-console, global-require */

import browserify from 'browserify';
import browserSync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import igdeploy from 'igdeploy';
import mergeStream from 'merge-stream';
import path from 'path';
import runSequence from 'run-sequence';
import source from 'vinyl-source-stream';
import subdir from 'subdir';
import vinylBuffer from 'vinyl-buffer';
import watchify from 'watchify';
import AnsiToHTML from 'ansi-to-html';

const $ = require('auto-plug')('gulp');
const ansiToHTML = new AnsiToHTML();

const AUTOPREFIXER_BROWSERS = [
  'ie >= 8',
  'ff >= 30',
  'chrome >= 34',
  'iOS >= 7',
  'Safari >= 7',
];

const DEPLOY_TARGET = ''; // e.g. 'features/YOUR-PROJECT-NAME'

const BROWSERIFY_ENTRIES = [
  'scripts/main.js',
];

const BROWSERIFY_TRANSFORMS = [
  'babelify',
  'debowerify',
];

const OTHER_SCRIPTS = [
  'scripts/top.js',
];

let env = 'development';


// helpers
let preventNextReload; // hack to keep a BS error notification on the screen
function reload() {
  if (preventNextReload) {
    preventNextReload = false;
    return;
  }

  browserSync.reload();
}

function handleBuildError(headline, error) {
  if (env === 'development') {
    // show in the terminal
    $.util.log(headline, error && error.stack);

    // report it in browser sync
    let report = (
      `<span style="color:red;font-weight:bold;font:bold 20px sans-serif">${headline}</span>`
    );

    if (error) {
      report += (
        `<pre style="text-align:left;max-width:800px">${ansiToHTML.toHtml(error.stack)}</pre>`
      );
    }

    browserSync.notify(report, 60 * 60 * 1000);
    preventNextReload = true;

    // allow the sass/js task to end successfully, so the process can continue
    this.emit('end');
  } else throw error;
}

// function to get an array of objects that handle browserifying
function getBundlers(useWatchify) {
  return BROWSERIFY_ENTRIES.map(entry => {
    const bundler = {
      b: browserify(path.posix.resolve('client', entry), {
        cache: {},
        packageCache: {},
        fullPaths: useWatchify,
        debug: useWatchify,
      }),

      execute() {
        let stream = this.b.bundle()
          .on('error', error => {
            handleBuildError.call(this, 'Error building JavaScript', error);
          })
          .pipe(source(entry.replace(/\.js$/, '.bundle.js')));

        // skip sourcemap creation if we're in 'serve' mode
        if (useWatchify) {
          stream = stream
            .pipe(vinylBuffer())
            .pipe($.sourcemaps.init({ loadMaps: true }))
            .pipe($.sourcemaps.write('./'));
        }

        return stream.pipe(gulp.dest('.tmp'));
      },
    };

    // register all the transforms
    BROWSERIFY_TRANSFORMS.forEach(transform => bundler.b.transform(transform));

    // upgrade to watchify if we're in 'serve' mode
    if (useWatchify) {
      bundler.b = watchify(bundler.b);
      bundler.b.on('update', files => {
        // re-run the bundler then reload the browser
        bundler.execute().on('end', reload);

        // also report any linting errors in the changed file(s)
        gulp.src(files.filter(file => subdir(path.resolve('client'), file)))
          .pipe($.eslint())
          .pipe($.eslint.format());
      });
    }

    return bundler;
  });
}

// compresses images (client => dist)
gulp.task('images', () => gulp.src('client/**/*.{jpg,png,gif,svg}')
  .pipe($.imagemin({
    progressive: true,
    interlaced: true,
  }))
  .pipe(gulp.dest('dist'))
);

// copies over miscellaneous files (client => dist)
gulp.task('copy', () => gulp.src(
  OTHER_SCRIPTS.concat([
    'client/**/*',
    '!client/**/*.{html,scss,js,jpg,png,gif,svg}', // all handled by other tasks
  ]), { dot: true })
  .pipe(gulp.dest('dist'))
);

gulp.task('build-pages', () =>
  gulp.src(['client/**/*.html', '!client/includes/**.html'])
      .pipe($.htmlTagInclude()).pipe(gulp.dest('.tmp'))
);

// minifies all HTML, CSS and JS (.tmp & client => dist)
gulp.task('html', done => {
  const assets = $.useref.assets({
    searchPath: ['.tmp', 'client', '.'],
  });

  gulp.src('.tmp/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify({ output: { inline_script: true } })))
    .pipe($.if('*.css', $.minifyCss({ compatibility: '*' })))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
    .on('end', () => {
      gulp.src('dist/**/*.html')
        .pipe($.smoosher())
        .pipe($.minifyHtml())
        .pipe(gulp.dest('dist'))
        .on('end', done);
    });
});

// clears out the dist and .tmp folders
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], { dot: true }));

// // runs a development server (serving up .tmp and client)
gulp.task('serve', ['styles', 'build-pages'], done => {
  const bundlers = getBundlers(true);

  // execute all the bundlers once, up front
  const initialBundles = mergeStream(bundlers.map(bundler => bundler.execute()));
  initialBundles.resume(); // (otherwise never emits 'end')

  initialBundles.on('end', () => {
    // use browsersync to serve up the development app
    browserSync({
      // notify: false,
      port: process.env.PORT || '3000',
      server: {
        baseDir: ['.tmp', 'client'],
        routes: {
          '/bower_components': 'bower_components',
        },
      },
    });

    // refresh browser after other changes
    gulp.watch(['client/**/*.html'], ['build-pages', reload]);
    gulp.watch(['client/styles/**/*.{scss,css}'], ['styles', reload]);
    gulp.watch(['client/images/**/*'], reload);

    done();
  });
});

// builds and serves up the 'dist' directory
gulp.task('serve:dist', ['build'], done => {
  require('browser-sync').create().init({
    open: false,
    notify: false,
    server: 'dist',
  }, done);
});

// task to do a straightforward browserify bundle (build only)
gulp.task('scripts', () =>
  mergeStream(getBundlers().map(bundler => bundler.execute()))
);

// builds stylesheets with sass/autoprefixer
gulp.task('styles', () => gulp.src('client/**/*.scss')
  .pipe($.sourcemaps.init())
  .pipe($.sass({ includePaths: 'bower_components' })
    .on('error', error => {
      handleBuildError.call(this, 'Error building Sass', error);
    })
  )
  .pipe($.autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
  .pipe($.sourcemaps.write('./'))
  .pipe(gulp.dest('.tmp'))
);

// lints JS files
gulp.task('eslint', () => gulp.src('client/scripts/**/*.js')
  .pipe($.eslint())
  .pipe($.eslint.format())
  .pipe($.if(env === 'production', $.eslint.failAfterError()))
);

// renames asset files and adds a rev-manifest.json
gulp.task('revision', () =>
  gulp.src(['dist/**/*.css', 'dist/**/*.js'])
    .pipe($.rev())
    .pipe(gulp.dest('dist'))
    .pipe($.rev.manifest())
    .pipe(gulp.dest('dist'))
);

// edits html to reflect changes in rev-manifest.json
gulp.task('revreplace', ['revision'], () =>
  gulp.src('dist/**/*.html')
    .pipe($.revReplace({ manifest: gulp.src('./dist/rev-manifest.json') }))
    .pipe(gulp.dest('dist'))
);

// sets up watch-and-rebuild for JS and CSS
gulp.task('watch', done => {
  runSequence('clean', ['scripts', 'styles', 'build-pages'], () => {
    gulp.watch('./client/**/*.html', ['build-pages']);
    gulp.watch('./client/**/*.scss', ['styles']);
    gulp.watch('./client/**/*.{js,hbs}', ['scripts', 'eslint']);
    done();
  });
});

// makes a production build (client => dist)
gulp.task('build', done => {
  env = 'production';

  runSequence(
    ['clean', 'eslint'],
    ['scripts', 'styles', 'copy', 'build-pages'],
    ['html', 'images'],
    ['revreplace'],
  done);
});

// task to deploy to the interactive server
gulp.task('deploy', done => {
  if (!DEPLOY_TARGET) {
    console.error('Please specify a DEPLOY_TARGET in your gulpfile!');
    process.exit(1);
  }

  igdeploy({
    src: 'dist',
    destPrefix: '/var/opt/customer/apps/interactive.ftdata.co.uk/var/www/html',
    dest: DEPLOY_TARGET,
  }, error => {
    if (error) done(error);
    else console.log(`Deployed to http://ig.ft.com/${DEPLOY_TARGET}/`);
  });
});
