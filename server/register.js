/**
 * Monkey-patching various global objects for Origami
 */

global.location = {
  hostname: 'ig.ft.com',
};

global.document.location = {
  href: 'ig.ft.com',
};

global.document.getElementsByTagName = () => [];
