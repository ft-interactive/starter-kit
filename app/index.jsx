/**
 * @file
 * Main client/SSR entry point.
 *
 * You probably don't want to touch anything in here unless you know what
 * you're doing. #justsayin
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './styles.scss';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
