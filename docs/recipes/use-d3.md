# Use d3.js

Install it with npm:

```sh
$ npm install --save-dev d3
```

> It's a front-end dependency, so we'd normally use bower. But d3 [doesn't work well](https://github.com/eugeneware/debowerify/issues/19) with debowerify. It works fine with npm though.


## Use it

Then just import it and use it.

```diff
 import oHoverable from 'o-hoverable';
+import d3 from 'd3';
 
 document.addEventListener('DOMContentLoaded', function () {
 
   // Automatically fix hover effects to work on touch devices
   oHoverable.init();
 
+  d3.select('main').append('p').text('hello from d3!');
 
 });
```
