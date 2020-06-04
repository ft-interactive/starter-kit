/**
 * @file
 * Main client/SSR entry point.
 *
 * You probably don't want to touch anything in here unless you know what
 * you're doing. #justsayin
 */

import React from 'react';
import { hydrate, render } from 'react-dom';
import App from './app';
import '@financial-times/g-components/shared/critical-path.scss';
import './styles.scss';

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}

// // This sets up the initial render and subsequent renders
// (async () => {
//   // Get context from JSON
//   try {

//     window.context = context; // Useful for debugging context issues

//     const {
//       buildTime,
//       id,
//       testCommentsUuid,
//       flags: { dark },
//     } = context;

//     const pageClasses = ['core', dark && 'dark'];

//     // These get added to the opening <html> element below.
//     const htmlAttributes = Object.entries({
//       lang: 'en-GB',
//       class: pageClasses.filter(i => i).join(' '),
//       'data-buildtime': buildTime,
//       'data-content-id': process.env.NODE_ENV === 'production' ? id || testCommentsUuid : id || '',
//     });

//     if (rootElement.hasChildNodes()) {
//       if (IS_DEV) console.info('hydrating...'); // eslint-disable-line
//       document.documentElement.classList.remove('core');
//       document.documentElement.classList.add('enhanced');
//       // Client, post-build.
//       hydrate(<App {...window.context} />, rootElement);
//     } else {
//       if (IS_DEV) console.info('initial render'); // eslint-disable-line
//       // Server, and client while developing
//       htmlAttributes.forEach(([k, v]) => {
//         document.documentElement.setAttribute(k, v);
//       });

//       // Set "enhanced" while developing
//       if (IS_DEV) {
//         document.documentElement.classList.remove('core');
//         document.documentElement.classList.add('enhanced');
//       }

//       const link = document.createElement('link');
//       link.setAttribute('rel', 'stylesheet');
//       link.setAttribute('href', criticalPath);

//       document.head.appendChild(link);
//       document.head.innerHTML += renderToString(<HtmlHead {...context} />);
//       render(<App {...window.context} />, rootElement);
//     }
//   } catch (e) {
//     console.error(e); // eslint-disable-line
//   }
// })();
