/**
 * @file
 * Main client/SSR entry point.
 *
 * You probably don't want to touch anything in here unless you know what
 * you're doing. #justsayin
 */

import React from 'react';
import { hydrate, render } from 'react-dom';
import '@financial-times/g-components/g-components.css';
import App from './app';
import './styles.scss';

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
