# Get data from Bertha

## Add a script tag

Add a script tag just before your final script bundle:

```diff
+    <script src="https://bertha.ig.ft.com/view/publish/js/SPREADSHEET_KEY/basic?d=spreadsheet"></script>
 
     <!-- build:js scripts/main.js -->
     <script src="scripts/main.bundle.js"></script>
     <!-- endbuild -->
   </body>
 </html>

```

Replace `SPREADSHEET_KEY` with the your Google Spreadsheet key. Also remember to share the spreadsheet so it's visible to @ft.com users (so Bertha can read it).

Now you should have the `spreadsheet` global available – try `console.log(spreadsheet);` to see its contents.

> You can use a different name for the global by altering the URL. Just change `d=spreadsheet` to `d=whatever`. (You will need to do this if you use more than one spreadsheet, or if you just want to give it a more meaningful name.)


## Configure ESLint

Edit your `.eslintrc` file to add a `globals` section:

```diff
+globals:
+  spreadsheet: true
```

(Or just add `spreadsheet: true` if there's already a `globals` section there.)

> This tells ESLint about the new `spreadsheet` global variable (which the Bertha script creates). This stops it complaining that you're using an undefined variable.
