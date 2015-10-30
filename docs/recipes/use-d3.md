# Use d3.js

## Install it with npm

```sh
$ npm install --save-dev d3
```


## Import it in your scripts and use it

```diff
 import oHoverable from 'o-hoverable';
 import FastClick from 'fastclick';
+import d3 from 'd3';
 
 document.addEventListener('DOMContentLoaded', function () {
   // make hover effects work on touch devices
   oHoverable.init();
 
   // remove the 300ms tap delay on mobile browsers
   FastClick.attach(document.body);
 
+  d3.select('main').append('p').text('hello from d3!');
 });
```
