# Add a new Browserify entry script

The `main.js` script is a Browserify entry.

Let's say you want to add another Browserify entry, `top.js`, to go in the `head`.

## 1. Add a script at `scripts/top.js`

```js
console.log('this is top.js!');
```

## 2. Add a new JS build block

The actual script tag should refer to `top.bundle.js`, as this will be its name once its bundled:

```diff
+    <!-- build:js scripts/top.js -->
+    <script src="scripts/top.bundle.js"></script>
+    <!-- endbuild -->
```

## 3. Edit the gulpfile

```diff
 var BROWSERIFY_ENTRIES = [
+  'scripts/top.js',
   'scripts/main.js'
 ];
```

Restart your `gulp serve` (or it should restart automatically if you're using `npm run serve` instead), and check your browser console and you should see the "this is top.js!" message.

As this top.js is being Browserified, you can use `require()` to load other modules into it.
