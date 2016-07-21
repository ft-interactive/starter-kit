function load_comments_lib() {
  document.removeEventListener('ig.Loaded', load_comments_lib);
  exec('https://origami-build.ft.com/v2/bundles/js?modules=o-comments@^3.1.0', true, true, show_comments);
}

function show_comments() {
  var comments = document.getElementById('comments');
  var id = document.documentElement.getAttribute('data-content-id');
  if (!comments || !id) return;
  new Origami['o-comments'](document.querySelector('#comments'), {
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

document.addEventListener('ig.Loaded', load_comments_lib);
