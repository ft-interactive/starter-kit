/**
 * @file
 * Main entry point for collecting configuration options, to be passed
 * to app as `context`.
 */

import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';

export default async (environment = 'development') => {
  const d = await article(environment);
  const flags = await getFlags(environment);
  const onwardJourney = await getOnwardJourney(environment);

  /**
   * @NB if you want pull some remote data into the app, here is probably
   * a good place to do it.
   */

  return {
    ...d,
    flags,
    onwardJourney,
  };
};
