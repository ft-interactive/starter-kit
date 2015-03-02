'use strict';

var gulp = require('gulp');
var del = require('del');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var mergeStream = require('merge-stream');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var watchify = require('watchify');
var $ = require('auto-plug')('gulp');


var AUTOPREFIXER_BROWSERS = [
  'ie >= 8',
  'ff >= 30',
  'chrome >= 34'
];

var BROWSERIFY_ENTRIES = [
  'scripts/top.js',
  'scripts/main.js'
];

var BROWSERIFY_TRANSFORMS = [
  'babelify'
];


// function to get an array of objects that handle browserifying
var getBundlers = function (useWatchify) {
  return BROWSERIFY_ENTRIES.map(function (entry) {
    var bundler = {
      b: browserify('./app/' + entry, {
        cache: {},
        packageCache: {},
        fullPaths: useWatchify,
        debug: useWatchify
      }),

      execute: function () {
        var stream = this.b.bundle()
          .on('error', $.util.log.bind($.util, 'Browserify error'))
          .pipe(source(entry.replace(/\.js$/, '.bundle.js')));

        // skip sourcemap creation if we're in 'serve' mode
        if (useWatchify) {
          stream = stream
            .pipe(vinylBuffer())
            .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.sourcemaps.write('./'));
        }

        return stream.pipe(gulp.dest('.tmp'));
      }
    };

    // register all the transforms
    BROWSERIFY_TRANSFORMS.forEach(function (transform) {
      bundler.b.transform(transform);
    });

    // upgrade to watchify if we're in 'serve' mode
    if (useWatchify) {
      bundler.b = watchify(bundler.b);
      bundler.b.on('update', function () {
        bundler.execute().on('end', browserSync.reload);
      });
    }

    return bundler;
  });
};


// task to do a straightforward browserify bundle
// (this is just for 'build'; not used during 'serve')
gulp.task('scripts', function () {
  return mergeStream(getBundlers().map(function (bundler) {
    return bundler.execute();
  }));
});


// task to lint scripts
gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});


// task to lint sass
gulp.task('scsslint', function () {
  return gulp.src('app/styles/**/*.scss')
    .pipe($.scssLint({bundleExec: true}));
});


// task to compress images during build
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});


// task to copy over miscellaneous files
gulp.task('copy', function () {
  return gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});


// task to compile stylesheets (during both 'serve' and 'build')
gulp.task('styles', function () {
  return $.rubySass('app/styles', {
    loadPath: 'bower_components',
    sourcemap: true,
    bundleExec: true
  })
    .on('error', function (err) { $.util.log.bind($.util, 'Sass error'); })
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(gulp.dest('dist/styles'));
});


// task to minify all HTML, CSS and JS (for build)
gulp.task('html', function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml()))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});


// task to clear out the destination folders
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));


// task to run a development server
gulp.task('serve', ['styles'], function (done) {
  var bundlers = getBundlers(true);

  // execute all the bundlers once, up front
  var initialBundles = mergeStream(bundlers.map(function (bundler) {
    return bundler.execute();
  }));
  initialBundles.resume(); // (otherwise never emits 'end')

  initialBundles.on('end', function () {
    // use browsersync to serve up the development app
    browserSync({
      notify: false,
      // https: true,
      server: {
        baseDir: ['.tmp', 'app'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    // refresh browser after other changes
    gulp.watch(['app/**/*.html'], browserSync.reload);
    gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', browserSync.reload]);
    gulp.watch(['app/images/**/*'], browserSync.reload);

    done();
  });
});


// task to build and serve up the 'dist' directory
gulp.task('serve:dist', ['build'], function () {
  browserSync({
    notify: false,
    // https: true,
    server: 'dist'
  });
});


// task to build the 'dist' version of the site
gulp.task('build', function (done) {
  runSequence(
    ['clean', 'jshint', 'scsslint'],
    ['styles', 'scripts'],
    ['html', 'images', 'copy'],
  done);
});
