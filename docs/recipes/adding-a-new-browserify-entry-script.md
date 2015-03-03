# Adding a new Browserify entry script

The `main.js` script is a Browserify entry.

Let's say you want to add another Browserify entry, `top.js`, to go in the `head`.

## 1. Add a new JS build block

The actual script tag should refer to `top.bundle.js`, as this will be its name once its bundled:

```diff
+    <!-- build:js scripts/top.js -->
+    <script src="scripts/top.bundle.js"></script>
+    <!-- endbuild -->
```

## 2. Edit the gulpfile

```diff
 var BROWSERIFY_ENTRIES = [
+  'scripts/top.js',
   'scripts/main.js'
 ];
```
