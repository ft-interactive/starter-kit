/**
 * Shared functions
 */

import promisify from 'es6-promisify';
import globOriginal from 'glob';
import { render } from 'node-sass';
import inlineSource from 'inline-source';
import chalk from 'chalk';

/**
 * This promisifies and exports a bunch of the dependencies, thus allowing
 * them to be used more easily with async/await.
 */
export const glob = promisify(globOriginal);
export const sassRender = promisify(render);
export const inline = promisify(inlineSource);

/**
 * This allows shorthand use of Chalk formatting.
 */
export const errMsg = chalk.white.bgRed;
export const infoMsg = chalk.white.bgBlue;
