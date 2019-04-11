/**
 * @file
 * Main client-side entry point.
 *
 * You probably don't want to touch anything in here unless you know what
 * you're doing. #justsayin
 */

import React from 'react';
import { hydrate } from 'react-dom';
import App from './app';
import './styles.scss';

(async () => {
  try {
    window.context = {
      ...(await (await fetch('./context.json')).json()),
      buildTime: window.BUILD_TIME,
    };
    hydrate(<App {...window.context} />, document.getElementById('app'));
  } catch (e) {
    console.error(e);
  }
})();
