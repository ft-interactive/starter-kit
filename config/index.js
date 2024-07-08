/**
 * @file
 * Main entry point for collecting configuration options, to be passed
 * to app as `context`.
 */

import article from './article.js';
import getFlags from './flags.js';
import getUrl from './url.js';
import relatedContent from './onward-journey.js';
import getData from './data.js';

export default async (environment = 'development', options = { withData: true }) => {
  const metadata = await article(environment);
  const url = await getUrl(metadata.url, environment);
  const data = options.withData ? await getData(environment) : {};
  const flags = await getFlags(environment);

  /**
   * @NB if you want pull some remote data into the app, here is probably
   * a good place to do it.
   */

  return {
    ...metadata,
    url,
    data,
    flags,
    pageClasses: `core${flags.dark ? ' dark' : ''}`,
    relatedContent,
    buildTime: new Date().toISOString(),
  };
};
