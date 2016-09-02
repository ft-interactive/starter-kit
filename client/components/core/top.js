/* eslint-disable
      camelcase,
      no-param-reassign,
      func-names,
      prefer-rest-params,
      no-console,
      operator-assignment,
      prefer-template,
      prefer-arrow-callback,
      prefer-rest-params,
      no-var
*/

// Load the polyfill service with custom features. Exclude big unneeded polyfills.
// and use ?callback= to clear the queue of scripts to load
var polyfill_features = [
  'default',
  'requestAnimationFrame',
  'Promise',
  'matchMedia',
  'HTMLPictureElement',
  'fetch|always|gated',
];

var polfill_url = 'https://cdn.polyfill.io/v2/polyfill.min.js?callback=clear_queue&features='
  + polyfill_features.join(',')
  + '&excludes=Symbol,Symbol.iterator,Symbol.species,Map,Set';

var queued_scripts = [];
var low_priority_queue = [];

// product-specific cuts-the-mustard test (customise for your needs)
window.cutsTheMustard = (typeof Function.prototype.bind !== 'undefined');

function add_script(src, async, defer, cb) {
  var script = document.createElement('script');
  var oldScript = document.getElementsByTagName('script')[0];

  script.src = src;
  script.async = !!async;
  if (defer) script.defer = !!defer;
  if (!cb && typeof defer === 'function') {
    cb = defer;
  }

  if (typeof cb === 'function') {
    if ({}.hasOwnProperty.call(script, 'onreadystatechange')) {
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded') {
          cb();
        }
      };
    } else {
      script.onload = cb;
    }
  }
  oldScript.parentNode.appendChild(script);
  return script;
}

function exec(script) {
  var s = typeof script;
  var args = Array.prototype.slice.call(arguments, 1);
  var i;

  if (!window.cutsTheMustard) return;
  if (s === 'string') {
    try {
      add_script.apply(window, arguments);
    } catch (e) {
      console.error(e);
    }
  } else if (s === 'function') {
    try {
      script();
    } catch (e) {
      console.error(e);
    }
  } else if (script) {
    try {
      for (i = 0; i < script.length; i++) {
        exec.apply(window, [script[i]].concat(args));
      }
    } catch (e) {
      console.error(e);
    }
  }
}

function queue(src, cb, low_priority) {
  var args = [src, true, !!low_priority, cb];

  if (!queued_scripts) {
    exec.apply(window, args);
    return;
  }

  if (low_priority) {
    low_priority_queue.push(args);
  } else {
    queued_scripts.push(args);
  }
}

function empty_queue(q) {
  var arr = q.slice(0);
  var i;

  for (i = 0; i < arr.length; i++) {
    exec.apply(window, arr[i]);
  }
}

function clear_queue() {
  var callback = low_priority_queue.length
    ? low_priority_queue[low_priority_queue.length - 1][3]
    : null;

  var done = function () {
    document.documentElement.className = document.documentElement.className + ' js-success';
  };

  var onLoaded = typeof callback !== 'function' ? done : function () {
    callback();
    done();
  };

  empty_queue(queued_scripts);
  queued_scripts = null;

  if (low_priority_queue.length) {
    low_priority_queue[low_priority_queue.length - 1][3] = onLoaded;
  } else {
    setTimeout(function () { onLoaded(); }, 1);
  }

  empty_queue(low_priority_queue);
  low_priority_queue = null;
}

window.queue = queue;
window.clear_queue = clear_queue;
window.exec = exec;

exec(function () {
  window.isNext = document.cookie.indexOf('FT_SITE=NEXT') !== -1;
  window.isLoggedIn = document.cookie.indexOf('FTSession=') !== -1;
  document.documentElement.className = document.documentElement.className.replace(/\bcore\b/g, [
    'enhanced',
    (window.isNext ? 'is-next' : 'is-falcon'),
    (window.isLoggedIn ? 'is-loggedin' : 'is-anonymous'),
  ].join(' '));
});

exec(polfill_url, true, true);
