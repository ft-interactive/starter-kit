/* eslint-disable */

queue('https://origami-build.ft.com/v2/bundles/js?modules=o-tracking&export=oTracking&autoinit=0', function () {
  var oTracking = window.oTracking['o-tracking'];
  var page_data = {
    content: { asset_type: 'interactive' }
  };

  var properties = [].reduce.call(document.querySelectorAll('head meta[property^="ft.track:"]')||[], function(o, el) {
    o[el.getAttribute('property').replace('ft.track:', '')] = el.getAttribute('content');
    return o;
  }, {});

  var id = document.documentElement.getAttribute('data-content-id');

  if (id) {
    page_data.content.uuid = id;
  }

  if (properties.microsite_name) {
    page_data.microsite_name = properties.microsite_name;
  }

  oTracking.init({
    server: 'https://spoor-api.ft.com/px.gif',
    system: {
      is_live: typeof properties.is_live === 'string' ? properties.is_live.toLowerCase() : false
    },
    context: { product: properties.product || 'IG' }
  });

  // Automatic link tracking
  oTracking.link.init();
  // Register page view
  oTracking.page(page_data);
}, true);
