/**
 * @file
 * Main client entrypoint.
 * The "render" function here is run on the client to hydrate the static HTML
 */

import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './app/app';

// eslint-disable-next-line import/prefer-default-export
export function render({ context }) {
  hydrateRoot(document.getElementById('root'), <App context={context} />);
}
