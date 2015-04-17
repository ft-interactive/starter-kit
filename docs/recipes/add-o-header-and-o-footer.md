# Add o-header and o-footer

It's fine to be running `gulp serve` while you're doing the following steps. There is no need to quit it; just open a new terminal tab so you can run other commands at the same time.


## 1. Install new dependencies

Use Bower to install the two Origami components we need:

```sh
$ bower install --save o-header o-footer
```

> Notes:
> - `--save` puts a reference to these new dependencies in your `bower.json`. This is so that when someone else checks out your project and runs `bower install`, they will automatically get the right dependencies.
> - You can use the shorthand `-s` instead of `--save` if you prefer.
> - Look inside `bower_components` to see what's been added. As well as `o-header` and `o-footer`, you may notice several other new components, which are dependencies of the two you installed. Bower figures this all out automatically, based on each component's own `bower.json`.


## 2. Add HTML

Go to the registry page for [o-header](http://registry.origami.ft.com/components/o-header) and choose which starting header you want to use. Then copy the sample HTML for that header and paste it into `client/index.html` as the first element in the `<body>`. (Adjust the indentation so it looks right.)

Then do the same thing for [o-footer](http://registry.origami.ft.com/components/o-footer), but paste the HTML template into the bottom (before the bottom scripts).

And save.

> In your browser, you should now see the **unstyled** header and footer contents.

## 3. Load the styles

Import the styles from the two components by editing `client/styles/main.scss`:

```diff
 @import 'o-fonts/main';
 @import 'o-colors/main';
+@import 'o-header/main';
+@import 'o-footer/main';
 
 @import 'functions';
 @import 'fonts';
```

> A few seconds after saving, your browser should reload, and the header and footer should now be fully styled.


## 4. Add the JavaScript for o-header

Edit `client/scripts/main.js`:

```diff
 import oHoverable from 'o-hoverable';
+import oHeader from 'o-header';
 
 document.addEventListener('DOMContentLoaded', function () {
   oHoverable.init(); // makes hover effects work on touch devices
   
+  // enhance the header element
+  const header = document.querySelector('body>header');
+  new oHeader(header);
 
 });
```

> This should make the header's dropdown menus work.
> 
> There is no JavaScript for o-footer.
