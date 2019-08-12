/**
 * @file
 * Main client/SSR entry point.
 *
 * You probably don't want to touch anything in here unless you know what
 * you're doing. #justsayin
 */

import React from 'react';
import { hydrate, render } from 'react-dom';
import { renderToString } from 'react-dom/server';
import { HtmlHead } from '@financial-times/g-components';
import criticalPath from '@financial-times/g-components/shared/critical-path.scss';
import App from './app';
import './styles.scss';

// This sets up the initial render and subsequent renders
(async () => {
  // Get context from JSON
  try {
    const context = {
      ...(await (await fetch('./context.json')).json()),
      buildTime: window.BUILD_TIME,
    };

    window.context = context; // Useful for debugging context issues

    const {
      buildTime, id, testCommentsUuid, flags: { dark },
    } = context;

    const pageClasses = ['core', dark && 'dark'];

    // These get added to the opening <html> element below.
    const htmlAttributes = Object.entries({
      lang: 'en-GB',
      class: pageClasses.filter(i => i).join(' '),
      'data-buildtime': buildTime,
      'data-content-id': process.env.NODE_ENV === 'production' ? id || testCommentsUuid : id || '',
    });

    let rootElement = document.getElementById('app');
    if (!rootElement) {
      const el = document.createElement('div');
      el.id = 'app';
      document.body.appendChild(el);
      rootElement = el;
    }

    if (rootElement.hasChildNodes()) {
      console.info('hydrating');
      document.documentElement.classList.remove('core');
      document.documentElement.classList.add('enhanced');
      // Client, post-build.
      hydrate(<App {...window.context} />, rootElement);
    } else {
      console.info('Initial render');
      // Server, and client while developing
      htmlAttributes.forEach(([k, v]) => {
        document.documentElement.setAttribute(k, v);
      });

      // Set "enhanced" while developing
      if (process.env.NODE_ENV === 'development') {
        console.log(process.env.NODE_ENV);
        document.documentElement.classList.remove('core');
        document.documentElement.classList.add('enhanced');
      }

      const link = document
        .createElement('link')
        .setAttribute('rel', 'stylesheet')
        .setAttribute('href', criticalPath);

      document.head.appendChild(link);
      document.head.innerHTML += renderToString(<HtmlHead {...context} />);
      render(<App {...window.context} />, rootElement);
    }
  } catch (e) {
    console.error(e);
  }
})();
