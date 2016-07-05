/* eslint-disable no-console, global-require */
import browserify from 'browserify';
import browserSync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import mergeStream from 'merge-stream';
import path from 'path';
import runSequence from 'run-sequence';
import source from 'vinyl-source-stream';
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
          .on('error', function(error) {
            handleBuildError.call(this, 'Error building JavaScript', error);
          })
          .pipe(source(entry));

        // If you want JS sourcemaps:
        //    1. npm i -D gulp-sourcemaps
        //    2. uncomment code below
        //
        //// skip sourcemap creation if we're in 'serve' mode
        // if (useWatchify) {
        //   stream = stream
        //    .pipe(vinylBuffer())
        //    .pipe($.sourcemaps.init({ loadMaps: true }))
        //    .pipe($.sourcemaps.write('./'));
        // }

        return stream.pipe(gulp.dest('dist'));
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
      });
    }

    return bundler;
  });
}

// IMAGE COMPRESSION:
// OPTIONAL TASK IF YOU HAVE IMAGES IN YOUR PROJECT REPO
//  1. install gulp-imagemin:
//       $ npm i -D gulp-imagemin
//  2. uncomment task below
//  3. Find other commented out stuff related to imagemin elsewhere in this gulpfile
//
// gulp.task('images', () => gulp.src('dist/**/*.{jpg,png,gif,svg}')
//   .pipe($.imagemin({
//     progressive: true,
//     interlaced: true,
//   }))
//   .pipe(gulp.dest('dist'))
// );

const copyGlob = OTHER_SCRIPTS.concat([
  'client/**/*',
  '!client/**/*.{html,scss}',

  // REPLACE: if using imagmin
  // '!client/**/*.{jpg,png,gif,svg}',

]);


// copies over miscellaneous files (client => dist)
gulp.task('copy', () =>
  gulp.src(copyGlob, { dot: true })
    .pipe(gulp.dest('dist'))
);

gulp.task('build-pages', () =>
  gulp.src(['client/**/*.html', '!client/includes/**.html'])
    .pipe($.htmlTagInclude())
    .pipe(gulp.dest('dist'))
);

// minifies all HTML, CSS and JS (dist & client => dist)
gulp.task('html', () =>
  gulp.src('dist/**/*.html')
    .pipe($.inlineSource())
    .pipe($.minifyHtml())
    .pipe(gulp.dest('dist'))
);

// clears out the dist and dist folders
gulp.task('clean', del.bind(null, ['dist', 'dist/*', '!dist/.git'], { dot: true }));

// // runs a development server (serving up dist and client)
gulp.task('watch', ['styles', 'build-pages', 'copy'], done => {
  const bundlers = getBundlers(true);

  // execute all the bundlers once, up front
  const initialBundles = mergeStream(bundlers.map(bundler => bundler.execute()));
  initialBundles.resume(); // (otherwise never emits 'end')

  initialBundles.on('end', () => {
    // use browsersync to serve up the development app
    browserSync({
      notify: true,
      open: process.argv.includes('--open'),
      ui: process.argv.includes('--bsui'),
      ghostMode: process.argv.includes('--ghost'),
      port: process.env.PORT || '3000',
      server: {
        baseDir: 'dist'
      },
    });

    // refresh browser after other changes
    gulp.watch(['client/**/*.html'], ['build-pages', reload]);
    gulp.watch(['client/styles/**/*.scss'], ['styles', reload]);
    gulp.watch(copyGlob, ['copy', reload]);

    // UNCOMMENT IF USING IMAGEMIN
    // gulp.watch(['client/images/**/*'], reload);

    done();
  });
});

// task to do a straightforward browserify bundle (build only)
gulp.task('scripts', () =>
  mergeStream(getBundlers().map(bundler => bundler.execute()))
);

// builds stylesheets with sass/autoprefixer
gulp.task('styles', () =>
  gulp.src('client/**/*.scss')
    .pipe($.sass({
        includePaths: 'bower_components',
        outputStyle: env === 'production' ? 'compressed' : 'expanded'
      }).on('error', function(error) {
          handleBuildError.call(this, 'Error building Sass', error);
      })
    )
    .pipe($.autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
    .pipe(gulp.dest('dist'))
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

// makes a production build (client => dist)
gulp.task('build', done => {
  env = 'production';
  runSequence(
    ['clean'],
    ['scripts', 'styles', 'build-pages', 'copy'],
    ['html' /*, 'images'*/],
    ['revreplace'],
  done);
});
