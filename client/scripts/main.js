import oHoverable from 'o-hoverable';
import FastClick from 'fastclick';

document.addEventListener('DOMContentLoaded', () => {
  // make hover effects work on touch devices
  oHoverable.init();

  // remove the 300ms tap delay on mobile browsers
  FastClick.attach(document.body);

  // YOUR CODE HERE!
});
