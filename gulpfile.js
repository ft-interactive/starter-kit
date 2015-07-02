'use strict';

var runSequence = require('run-sequence');
var obt = require('origami-build-tools');
var $ = require('auto-plug')('gulp');
var gulp = require('gulp');
var del = require('del');

var bs;


// compresses images (client => dist)
gulp.task('images', function () {
  return gulp.src('client/**/*.{jpg,png,gif,svg}')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist'));
});


// copies over miscellaneous files (client => dist)
gulp.task('copy', function () {
  return gulp.src([
    'client/**/*',
    '!client/**/*.{html,scss,js,jpg,png,gif,svg}', // all handled by other tasks
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});


// minifies all HTML, CSS and JS (.tmp & client => dist)
gulp.task('html', function (done) {
  var assets = $.useref.assets({searchPath: ['.tmp', 'client', '.']});

  gulp.src('client/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify({
      output: {
        inline_script: true,
        beautify: false
      }
    })))
    .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
    .on('end', function () {
      gulp.src('dist/**/*.html')
        .pipe($.smoosher())
        .pipe($.minifyHtml())
        .pipe(gulp.dest('dist'))
        .on('end', done);
    });
});


// clears out the dist and .tmp folders
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));


// runs a development server (serving up .tmp and client)
gulp.task('serve', ['watch'], function (done) {
  bs = require('browser-sync').create();

  bs.init({
    files: ['.tmp/**/*', 'client/**/*'],
    server: {
      baseDir: ['.tmp', 'client'],
      routes: {
        '/bower_components': 'bower_components'
      }
    },
    open: false,
    notify: false,
  }, done);
});


// builds and serves up the 'dist' directory
gulp.task('serve:dist', ['build'], function (done) {
  require('browser-sync').create().init({
    open: false,
    notify: false,
    server: 'dist'
  }, done);
});


// builds scripts with browserify
gulp.task('scripts', function () {
  return obt.build.js(gulp, {
    buildFolder: '.tmp',
    js: './client/scripts/main.js',
    buildJs: 'scripts/main.bundle.js',
  }).on('error', function (error) {
    console.error(error);
    this.emit('end');
  });
});


// builds stylesheets with sass/autoprefixer
gulp.task('styles', function () {
  return obt.build.sass(gulp, {
    buildFolder: '.tmp',
    sass: './client/styles/main.scss',
    buildCss: 'styles/main.css',
  }).on('error', function (error) {
    console.error(error);
    this.emit('end');
  });
});


// lints JS files (DISABLED for poor ES6 support; we're going to switch to ESLint)
// gulp.task('jshint', function () {
//   return obt.verify.jsHint(gulp, {
//     jshint: './client/scripts/*.js',
//   }).on('error', function (error) {
//     console.error('\n', error, '\n');
//     this.emit('end');
//   });
// });


// lints SCSS files
gulp.task('scsslint', function () {
  return obt.verify.scssLint(gulp, {
    sass: './client/styles/*.scss',
  }).on('error', function (error) {
    console.error('\n', error, '\n');
    this.emit('end');
  });
});


// sets up watch-and-rebuild for JS and CSS
gulp.task('watch', function (done) {
  runSequence('clean', ['scripts', 'styles'], function () {
    gulp.watch('./client/**/*.scss', ['styles', 'scsslint']);
    gulp.watch('./client/**/*.{js,hbs}', ['scripts'/*, 'jshint'*/]);
    done();
  });
});


// makes a production build (client => dist)
gulp.task('build', function (done) {

  runSequence(
    ['clean', 'scsslint'/*, 'jshint'*/],
    ['scripts', 'styles', 'copy'],
    ['html', 'images'],
  done);
});
