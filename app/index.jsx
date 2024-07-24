import React from 'react';
import { render } from 'react-dom';
import App from './app';
import './styles.scss';

const context = JSON.parse(document.getElementById('__context__').textContent);

const rootElement = document.getElementById('root');

render(<App context={context} />, rootElement);
