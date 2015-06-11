# Add a deploy task

> NB. this will eventually be built into an IG-specific fork of this boilerplate.


# 1. Install the [igdeploy](https://github.com/ft-interactive/igdeploy) module

```sh
$ npm install --save-dev igdeploy
```

# 2. Edit your gulpfile.js

First, import the igdeploy module:

```diff
 'use strict';

 var gulp = require('gulp');
 var del = require('del');
+var igdeploy = require('igdeploy');
 var path = require('path');
 var browserify = require('browserify');
```

Then add a new task at the bottom of the file (but **edit this** so the `dest` is something appropriate for your project):

```diff
+// task to deploy to the interactive server
+gulp.task('deploy', igdeploy.bind(null, {
+  src: 'dist',
+  destPrefix: '/var/opt/customer/apps/interactive.ftdata.co.uk/var/www/html',
+  dest: 'features/YYYY-MM-DD_your-project-name',
+  baseURL: 'http://www.ft.com/ig/',
+}));
```
