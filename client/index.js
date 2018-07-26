/**
 * @file
 * Main client-side entry point.
 */

import React from 'react';
import { hydrate } from 'react-dom';
import App from './app';
import getContext from '../config';

(async () => hydrate(React.createElement(App, await getContext()), document.getElementById('app')))();
