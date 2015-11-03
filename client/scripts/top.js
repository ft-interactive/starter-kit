/* eslint-disable */

// global addScript function
function addScript(src, async, defer) {
  if (!async && !defer) {
    document.write('<script src="' + src + '">\x3c/script>');
  }
  else {
    var script = document.createElement('script');
    script.src = src;
    script.async = !!async;
    if (defer) script.defer = !!defer;
    var oldScript = document.getElementsByTagName('script')[0];
    oldScript.parentNode.appendChild(script);
    return script;
  }
}

// product-specific cuts-the-mustard test (customise for your needs)
var cutsTheMustard = (
  'querySelector' in document &&
  'localStorage' in window &&
  'addEventListener' in window
);

// set the root element to .core or .enhanced as appropriate
if (cutsTheMustard) {
  document.documentElement.className = (
    document.documentElement.className.replace(/\bcore\b/g, 'enhanced')
  );
}

// add a polyfill.io script.
// see polyfill.io for how to add non-default polyfills to this.
// Note: you may also want to add this conditionally - a basic one for non-CTM
// browsers (just to get basics like the HTML5 Shiv), and a special one (with
// things like Promise) for CTM browsers.
addScript('https://cdn.polyfill.io/v1/polyfill.min.js');
