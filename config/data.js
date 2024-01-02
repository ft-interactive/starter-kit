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

// eslint-disable-next-line no-unused-vars
export async function fetchData(mode) {
  /**
   * @TODO Add any data downloading or parsing logic here.
   * The return value of this method will be available
   * inside the context provider as "context.data."
   *
   * If 'mode' is either 'development' or 'production', the function is running at build time.
   * If 'mode' is 'cli', the function is running manually via "npm run download."
   *
   * Note that if you are running this function at build time, any files you access must be included
   * in the vite build. This means you should either read data from public/, or (preferrably) only
   * use dynamic import() statements to load.
   *
   * See below for examples of how to load raw text/csv or JSON files:
   */

  // This { as: 'raw' } option imports files as plaintext
  const dataFiles = import.meta.glob('../data/*.csv', { as: 'raw' });
  const csv = await dataFiles['../data/example.csv']();

  // JSON files can be import()-ed directly
  const json = (await import('../data/example.json')).default;

  // Remote fetch() calls can also work

  return { csv, json };
}

export default async function getData(mode = 'development') {
  /**
   * DON'T add your data-loading code in this function - instead, use fetchData() above.
   * This helper checks for a local data file (generated by scripts/data.js), and loads it if available.
   * Otherwise, it calls fetchData() above to live-reload data at build time.
   */
  try {
    const files = import.meta.glob('./data.json');
    if (files['./data.json']) return files['./data.json']();

    throw new Error('No data file');
  } catch (e) {
    console.log('Falling back to dynamic fetchData() function...'); // eslint-disable-line no-console
    return fetchData(mode);
  }
}
