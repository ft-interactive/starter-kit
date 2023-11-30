/**
 * @file
 * Main server entrypoint.
 * This file is used by Vike to pre-generate the page HTML at build time.
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { dangerouslySkipEscape } from 'vike/server';

import { compile } from 'ejs';

// eslint-disable-next-line import/no-unresolved
import indexTemplate from './index.html?raw';

import App from './app/app';

import getContext from './config/index.js';

const template = compile(indexTemplate);

// eslint-disable-next-line import/prefer-default-export
export async function render() {
  // Get story context and settings to pass to the client
  const context = await getContext(import.meta.env.NODE_ENV);
  console.log('data', context.data);

  // Render React app to HTML
  const appHtml = ReactDOMServer.renderToString(<App context={context} />);

  // Insert context and appHtml into the full page
  // (We override Vite's escaping here because EJS already escapes it)
  const documentHtml = dangerouslySkipEscape(template({ context, appHtml }));

  return {
    documentHtml,
    pageContext: { context },
  };
}

// Vike requires us to select which pageContext keys are available in the client
export const passToClient = ['context'];
