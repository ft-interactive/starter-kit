/**
 * @file
 * This is the root component for your project.
 * Split logical parts of you project into components e.g.
 *
 *    /app
 *      - /components
 *          - /component-name
 *              - styles.scss
 *              - index.js
 *
 * If you want to import some data, just import it like you would JavaScript:
 *
 *    import data from '../data/example.csv';
 *
 * Provided that you're loading a file ending in either .csv or .tsv, Webpack
 * will automatically parse it into an object via the header row. This behaviour
 * can be customised in webpack.config.babel.js.
 *
 * Note, however, that doing it this way will increase your bundle size, which
 * might slow down time to interactive (TTI).
 *
 * A better way is to dynamically import data inside the useEffect() hook — this
 * way your application can load its UI components and then get data piped in
 * once all the components are on page:
 *
 * ```
 *  useEffect(() => {
 *    (async () => {
 *      const { default: data } = await import('../data/example.csv');
 *      setState({ data });
 *    })();
 *  }, []);
 * ```
 * A couple things to note:
 *   - `import()` returns a promise, so you have to either use `.then()` or
 *     the `await` keyword in an `async` function.
 *   - The equivalent ES6 import syntax is `import * as varname from 'module'`,
 *     meaning that you probably just want the `default` property in the resulting
 *     object. This is what's happening above with `const { default: data }`, it's
 *     destructuring the result of `import()` and assigning the default export
 *     to a constant named `data`.
 *   - It's recommended that if you want to use an async function for this, you
 *     do this as an IIFE inside of `useEffect` — not make `useEffect`'s callback
 *     `async`. Bit weird, I know.
 *
 *  See below for complete example.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useData } from 'vike-react/useData';

import { ArticleLayout as Layout, StoryTopper } from '@financial-times/g-components';
import '@financial-times/g-components/styles.css';

import Credits from '@ft-interactive/vs-components/Credits';
import GridWrapperHelper from '@ft-interactive/vs-components/GridWrapperHelper';

import { DimensionsProvider } from '@ft-interactive/vs-components/hooks';

import '@ft-interactive/vs-components/styles.css';

import { ContextPropType } from '../../util/prop-types';
import SampleStoryBody from '../../util/SampleStoryBody';

import './styles.scss';

const App = () => {
  const context = useData();

  return (
    <DimensionsProvider>
      <Layout {...context}>
        <main key="main" role="main">
          <article className="article" itemScope itemType="http://schema.org/Article">
            <GridWrapperHelper colspan="12 S11 Scenter M9 L8 XL7" className="article-head">
              <StoryTopper {...context} />
            </GridWrapperHelper>

            <div className="article-body o-editorial-typography-body" itemProp="articleBody">
              <SampleStoryBody />

              <GridWrapperHelper colspan="12 S11 Scenter M9 L8 XL7">
                <Credits
                  share={{
                    url: context.url,
                    socialHeadline: context.socialHeadline || context.headline,
                    tweetText: context.tweetText || context.twitterHeadline,
                    facebookHeadline: context.facebookHeadline,
                  }}
                  dark={context.flags.dark}
                />
              </GridWrapperHelper>
            </div>
          </article>
        </main>
      </Layout>
    </DimensionsProvider>
  );
};

App.propTypes = {
  context: PropTypes.shape(ContextPropType),
};

export default App;
