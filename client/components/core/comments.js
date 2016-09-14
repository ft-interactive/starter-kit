/* eslint-disable */

function show_comments() {
  var comments = document.getElementById('comments');
  var id = document.documentElement.getAttribute('data-content-id');
  if (!comments || !id) return;
  if (!window.oComments) {
    throw new Error('Could not load oComments');
  }
  new oComments['o-comments'](comments, {
    title: document.title,
    url: document.location.href,
    articleId: id,
    livefyre: {
      initialNumVisible: 10,
      disableIE8Shim: true,
      disableThirdPartyAnalytics: true
    }
  });
}

queue('https://origami-build.ft.com/v2/bundles/js?export=oComments&modules=o-comments@^3.1.0&autoinit=0', function(){
  setTimeout(show_comments, 1000);
}, true);
