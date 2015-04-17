# Get data from Bertha

Add a script tag just before your final script bundle:

```diff
+    <script src="http://bertha.ig.ft.com/view/publish/js/SPREADSHEET_KEY/basic?d=spreadsheet"></script>
 
     <!-- build:js scripts/main.js -->
     <script src="scripts/main.bundle.js"></script>
     <!-- endbuild -->
   </body>
 </html>

```

Replace `SPREADSHEET_KEY` with the your Google Spreadsheet key. Also remember to share the spreadsheet so it's visible to @ft.com users (so Bertha can read it).

Then edit your `.jshintrc` to tell JSHint about the new global (so it won't complain when you use it):

```diff
   "globals": {
-     "onDomReady": true
+     "onDomReady": true,
+     "spreadsheet": true
   }
```

Now you should have the `spreadsheet` global available – try `console.log(spreadsheet);` to see its contents.

> You can use a different name for the global by altering the URL. Just change `d=spreadsheet` to `d=whatever`. (You will need to do this if you use more than one spreadsheet, or if you just want to give it a more meaningful name.)
