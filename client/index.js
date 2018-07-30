/**
 * @file
 * Main client-side entry point.
 */

import React from 'react';
import { hydrate } from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './app';
import getContext from '../config';

(async () => {
  const ctx = await getContext();
  hydrate(
    <HelmetProvider>
      <App {...ctx} />
    </HelmetProvider>,
    document.getElementById('app'),
  );
})();
