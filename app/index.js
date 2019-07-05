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

(async () => {
  try {
    const context = (window.context = {
      ...(await (await fetch('./context.json')).json()),
      buildTime: window.BUILD_TIME,
    });

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
      // Client, post-build.
      hydrate(<App {...window.context} />, rootElement);
    } else {
      // Server, and client while developing
      htmlAttributes.forEach(([k, v]) => {
        document.documentElement.setAttribute(k, v);
      });
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = criticalPath;

      document.head.appendChild(link);
      document.head.innerHTML += renderToString(<HtmlHead {...context} />);
      render(<App {...window.context} />, rootElement);
    }
  } catch (e) {
    console.error(e);
  }
})();
