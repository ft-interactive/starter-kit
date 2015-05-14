/*jshint node:true*/
'use strict';

var gulp = require('gulp');
var obt = require('origami-build-tools');
var del = require('del');
var runSequence = require('run-sequence');
var $ = require('auto-plug')('gulp');
var bs;


// compresses images (client => dist)
gulp.task('images', function () {
  return gulp.src('client/images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'));
});


// copies over miscellaneous files (client => dist)
gulp.task('copy', function () {
  return gulp.src([
    'client/*',
    '!client/*.html'
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
    open: false
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


// does browserify and sass/autoprefixer
gulp.task('preprocess', function () {
  return obt.build(gulp, {
    buildFolder: '.tmp',
    js: './client/scripts/main.js',
    buildJs: 'scripts/main.bundle.js',
    sass: './client/styles/main.scss',
    buildCss: 'styles/main.css'
  });
});


// performs linting etc.
gulp.task('verify', function () {
  // return obt.verify(gulp, {
  //   js: './client/scripts/*.js',
  //   sass: './client/scripts/*.scss',
  // });

  $.util.log('"verify" task disabled until OBT errors issue resolved');
});


// sets up watching and reloading
gulp.task('watch', ['preprocess'], function () {
  // files that need preprocessing
  gulp.watch('./client/**/*.{js,scss}', function () {
    runSequence('preprocess', 'verify');
  });
});


// makes a production build (client => dist)
gulp.task('build', function (done) {

  runSequence(
    'clean',
    'verify',
    'preprocess',
    ['html', 'images', 'copy'],
  done);
});
