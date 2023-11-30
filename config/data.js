/**
 * @file
 * Data downloading and configuration.
 *
 * Use this file to do any custom data-fetching you might need.
 * Maybe you want to download it from an API or Google Sheet,
 * or read/process some files from the data/ directory.
 *
 * Note that this function will be called only at BUILD time
 * on the server: that is, when you push changes to Github
 * and CircleCI rebuilds the HTML. If you know the data will change,
 * you should load it here then add a useEffect() in app.jsx to fetch
 * the latest version on the client.
 */
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'node:fs/promises';

const filePath = resolve(fileURLToPath(import.meta.url));
const nodePath = resolve(process.argv[1]);
const dataFile = resolve(dirname(filePath), './data.json');

// eslint-disable-next-line no-unused-vars
async function fetchData(mode) {
  /**
   * @TODO Add any data downloading or parsing logic here.
   * The return value of this method will be available
   * inside the context provider as "context.data."
   *
   * If 'mode' is set (either 'development' or 'production'), the function is running at build time.
   *
   */

  return {};
}

export default async function getData(mode = 'development') {
  // Load data from local file if available
  // Otherwise, download it live at buildtime
  try {
    return JSON.parse(await fs.readFile(dataFile));
  } catch (e) {
    return fetchData(mode);
  }
}

/**
 * If this script is run directly, e.g. `node config/data.js`, then it will
 * call the function above and cache the value in config/data.json.
 * This de-couples your data loading process from the build step — which can be useful
 * e.g. if you want to verify changes (like pulling in text from a Google Doc).
 */

if (filePath.includes(nodePath)) {
  console.log('Calling fetchData()...'); // eslint-disable-line no-console
  fetchData(process.env.MODE || 'development')
    .then((data) => fs.writeFile(dataFile, JSON.stringify(data)))
    .then(() => {
      console.log('✓ Cached results in config/data.json'); // eslint-disable-line no-console
    });
}
