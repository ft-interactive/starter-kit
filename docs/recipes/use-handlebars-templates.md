# Using Handlebars templates

## 1. Install dependencies

```sh
npm install --save-dev handlebars hbsfy
```

> This installs [Handlebars](http://handlebarsjs.com/), plus a Browserify transform called [hbsfy](https://github.com/epeli/node-hbsfy), which precompiles `.hbs` files into JavaScript when you import them.


## 2. Edit your gulpfile

Add hbsfy as a transform in your `preprocess` task:

```diff
 // does browserify and sass/autoprefixer
 gulp.task('preprocess', function () {
   return obt.build(gulp, {
     buildFolder: '.tmp',
     js: './client/scripts/main.js',
     buildJs: 'scripts/main.bundle.js',
+    transforms: [require('hbsfy')],
     sass: './client/styles/main.scss',
     buildCss: 'styles/main.css'
   });
 });
```

Configure `gulp.watch` to rebuild whenever `.hbs` files change:

```diff
 // sets up watching and reloading
 gulp.task('watch', ['preprocess'], function () {
   // files that need preprocessing
-  gulp.watch('./client/**/*.{js,scss}', function () {
+  gulp.watch('./client/**/*.{js,hbs,scss}', function () {
     runSequence('preprocess', 'verify');
   });
 });
``` 

> NB. You'll need to restart your `gulp serve` after this change – or if you're using `npm run serve`, it will restart automatically.


## 3. Make some templates and use them

Make a new directory `client/templates`, and add a template file, e.g. `example.hbs`:

```hbs
<b>{{foo}}</b>
```

Then, in your `main.js`, import the template:

```diff
 import oHoverable from 'o-hoverable';
+import exampleTemplate from '../templates/example.hbs';
 
 document.addEventListener('DOMContentLoaded', function () {
   // make hover effects work on touch devices
   oHoverable.init();
 
+  // do something with the template...
+  document.querySelector('main').innerHTML = exampleTemplate({foo: 'hi'});
 });
```
