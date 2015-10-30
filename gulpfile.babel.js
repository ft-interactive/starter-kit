import runSequence from 'run-sequence';
import obt from 'origami-build-tools';
import gulp from 'gulp';
import del from 'del';

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
  return gulp.src([
    'client/**/*',
    '!client/**/*.{html,scss,js,jpg,png,gif,svg}', // all handled by other tasks
  ], {dot: true})
    .pipe(gulp.dest('dist'));
});


// minifies all HTML, CSS and JS (.tmp & client => dist)
gulp.task('html', done => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'client', '.']});

  gulp.src('client/**/*.html')
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
    js: './client/scripts/main.js',
    buildJs: 'scripts/main.bundle.js',
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


// lints JS files (DISABLED for poor ES6 support; we're going to switch to ESLint)
// gulp.task('jshint', () => {
//   return obt.verify.jsHint(gulp, {
//     jshint: './client/scripts/*.js',
//   }).on('error', function (error) {
//     console.error('\n', error, '\n');
//     this.emit('end');
//   });
// });


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
    gulp.watch('./client/**/*.{js,hbs}', ['scripts'/*, 'jshint'*/]);
    done();
  });
});


// makes a production build (client => dist)
gulp.task('build', done => {
  env = 'production';

  runSequence(
    ['clean', 'scsslint'/*, 'jshint'*/],
    ['scripts', 'styles', 'copy'],
    ['html', 'images'],
  done);
});
