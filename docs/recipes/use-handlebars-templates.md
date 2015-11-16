# Using Handlebars templates

## 1. Install dependencies

```sh
npm install --save-dev handlebars hbsfy
```

> This installs [Handlebars](http://handlebarsjs.com/), plus a Browserify transform called [hbsfy](https://github.com/epeli/node-hbsfy), which precompiles `.hbs` files into JavaScript when you import them.


## Edit gulpfile.js

```diff
 var BROWSERIFY_TRANSFORMS = [
   'babelify',
   'debowerify',
+  'hbsfy',
 ];
```

> You'll need to restart your `gulp serve` after this change – or if you're using `npm start` it should restart automatically.

## Make some templates and use them.

Make a new directory `client/templates`, and add a template file, e.g. `example.hbs`:

```hbs
<b>{{foo}}</b>
```

Then, in your script, import the template:

```diff
 import oHoverable from 'o-hoverable';
+import exampleTemplate from '../templates/example.hbs';
 
 document.addEventListener('DOMContentLoaded', function () {
   oHoverable.init(); // makes hover effects work on touch devices
 
+  // do something with a template
+  document.querySelector('main').innerHTML = exampleTemplate({foo: 'hi'});
 });
```
