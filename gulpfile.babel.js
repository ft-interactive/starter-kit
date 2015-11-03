import del from 'del';
import gulp from 'gulp';
import igdeploy from 'igdeploy';
import obt from 'origami-build-tools';
import path from 'path';
import runSequence from 'run-sequence';


// Specify a destination directory for deploying this project
const deployTarget = ''; // e.g. 'features/YOUR-PROJECT-NAME'

const webpackEntry = './client/scripts/main.js';
const webpackOutput = 'scripts/main.bundle.js';
const otherScripts = [
  'client/scripts/top.js',
];

const $ = require('auto-plug')('gulp');
let env = 'development';


// compresses images (client => dist)
gulp.task('images', () => {
  return gulp.src('client/**/*.{jpg,png,gif,svg}')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
    }))
    .pipe(gulp.dest('dist'));
});


// copies over miscellaneous files (client => dist)
gulp.task('copy', () => {
  return gulp.src(otherScripts.concat([
    'client/**/*',
    '!client/**/*.{html,scss,js,jpg,png,gif,svg}', // all handled by other tasks
  ]), {dot: true})
    .pipe(gulp.dest('dist'));
});


// minifies all HTML, CSS and JS (.tmp & client => dist)
gulp.task('html', done => {
  const assets = $.useref.assets({
    searchPath: ['.tmp', 'client', '.'],
  });

  gulp.src('client/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify({output: {inline_script: true}})))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
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
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));


// runs a development server (serving up .tmp and client)
gulp.task('serve', ['watch'], done => {
  const bs = require('browser-sync').create();

  bs.init({
    files: ['.tmp/**/*', 'client/**/*'],
    server: {
      baseDir: ['.tmp', 'client'],
      routes: {
        '/bower_components': 'bower_components',
      },
    },
    open: false,
    notify: false,
  }, done);
});


// builds and serves up the 'dist' directory
gulp.task('serve:dist', ['build'], done => {
  require('browser-sync').create().init({
    open: false,
    notify: false,
    server: 'dist',
  }, done);
});


// builds scripts with webpack
gulp.task('scripts', () => {
  return obt.build.js(gulp, {
    buildFolder: '.tmp',
    js: webpackEntry,
    buildJs: webpackOutput,
    env: env,
  }).on('error', function (error) {
    console.error(error);
    this.emit('end');
  });
});


// builds stylesheets with sass/autoprefixer
gulp.task('styles', () => {
  return obt.build.sass(gulp, {
    buildFolder: '.tmp',
    sass: './client/styles/main.scss',
    buildCss: 'styles/main.css',
  }).on('error', function (error) {
    console.error(error);
    this.emit('end');
  });
});


// lints JS files
gulp.task('eslint', () => {
  return obt.verify.esLint(
    gulp, path.resolve('.eslintrc')
  ).on('error', function (error) {
    console.error('\n', error, '\n');
    this.emit('end');
  });
});


// lints SCSS files
gulp.task('scsslint', () => {
  return obt.verify.scssLint(gulp, {
    sass: './client/styles/*.scss',
  }).on('error', function (error) {
    console.error('\n', error, '\n');
    this.emit('end');
  });
});


// sets up watch-and-rebuild for JS and CSS
gulp.task('watch', done => {
  runSequence('clean', ['scripts', 'styles'], () => {
    gulp.watch('./client/**/*.scss', ['styles', 'scsslint']);
    gulp.watch('./client/**/*.{js,hbs}', ['scripts', 'eslint']);
    done();
  });
});


// makes a production build (client => dist)
gulp.task('build', done => {
  env = 'production';

  runSequence(
    ['clean', 'scsslint', 'eslint'],
    ['scripts', 'styles', 'copy'],
    ['html', 'images'],
  done);
});


// task to deploy to the interactive server
gulp.task('deploy', done => {
  if (!deployTarget) {
    console.error('Please specify a deployTarget in your gulpfile!');
    process.exit(1);
  }

  igdeploy({
    src: 'dist',
    destPrefix: '/var/opt/customer/apps/interactive.ftdata.co.uk/var/www/html',
    dest: deployTarget,
  }, error => {
    if (error) return done(error);
    console.log(`Deployed to http://ig.ft.com/${deployTarget}/`);
  });
});
