# Using Handlebars templates

## 1. Install dependencies

```sh
npm install --save-dev handlebars hbsfy
```

> After doing this, check that your `package.json` now contains both the new devDependencies.
> - [handlebars](http://handlebarsjs.com/), the actual template engine
> - a Browserify transform called [hbsfy](https://github.com/epeli/node-hbsfy), which precompiles `.hbs` files into plain JavaScript (whenever you import them from a `.js` file).


## 2. Edit your gulpfile

Add hbsfy as a transform in your `scripts` task:

```diff
 // builds scripts with browserify
 gulp.task('scripts', function () {
   return obt.build.js(gulp, {
     buildFolder: '.tmp',
     js: './client/scripts/main.js',
     buildJs: 'scripts/main.bundle.js',
+    transforms: [require('hbsfy')],
   }).on('error', function (error) {
     console.error(error);
     this.emit('end');
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
