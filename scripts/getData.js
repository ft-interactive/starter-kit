/**
 * @file scripts/getData.js
 * Runs the user-specified data fetching config and caches it as JSON.
 * Execute this using "npm run data"
 *
 * NOTE: You probably don't need to edit this file. Instead, add your data fetching code
 * inside the "fetchData" function inside config/data.js. Then, run "npm run data" if
 * you want to cache it in config/data.json. (If you don't run the npm script and
 * no JSON cache is created, your data fetching code will instead run every build.
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFile } from 'fs/promises';
import { createServer as createViteServer } from 'vite';

const filePath = resolve(fileURLToPath(import.meta.url));
const dataFile = resolve(dirname(filePath), '../config/data.json');

const vite = await createViteServer({
  server: { middlewareMode: true, watch: null },
});

const { fetchData } = await vite.ssrLoadModule('/config/data.js');

console.log('Calling fetchData()...'); // eslint-disable-line no-console
fetchData('cli')
  .then((data) => writeFile(dataFile, JSON.stringify(data, undefined, 4)))
  .then(() => {
    console.log('✓ Cached results in config/data.json'); // eslint-disable-line no-console
  });

vite.close();
