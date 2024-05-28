/**
 * @file
 * Main client entrypoint.
 * The "render" function here is run on the client to hydrate the static HTML
 */

import React from 'react';
import { hydrateRoot } from 'react-dom/client';

// eslint-disable-next-line import/prefer-default-export
export function onRenderClient({ context, Page }) {
  hydrateRoot(document.getElementById('root'), <Page context={context} />);
}
