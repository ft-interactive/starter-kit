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
import { ArticleLayout as Layout, StoryTopper, Grid } from '@financial-times/g-components';
import '@financial-times/g-components/styles.css';
import { Credits, GridWrapperHelper } from '@ft-interactive/vs-components';

import '@ft-interactive/vs-components/styles.css';

import { ContextPropType } from './util/prop-types';

const { GridChild, GridRow, GridContainer } = Grid;

const App = ({ context }) => (
  <Layout {...context}>
    <main key="main" role="main">
      <article className="article" itemScope itemType="http://schema.org/Article">
        <GridWrapperHelper colspan="12 S11 Scenter M9 L8 XL7" className="article-head">
          <StoryTopper {...context} />
        </GridWrapperHelper>
        
        <div className="article-body o-editorial-typography-body" itemProp="articleBody">
          <GridWrapperHelper colspan="12 S11 Scenter M9 L8 XL7">
            <div className="o-editorial-layout-wrapper">
              <p>
                Ik kie neġi æpude pōsÞpriskribo, anċ ēg tiel subtegmenÞo. Giga gārði esperǣntigo
                vi jes. Ċit plēj esceptīnte hu, ōl vola eksploðæ poǽ. Ōīð gh pǽƿjo s&apos;joro
                pronomeċa, mi paki vice fiksa vir. Trǣ kibi multa ok, sur ðū īnfāno kæŭze. Om
                ene modō sekvanta proksimumecō, ānÞ sh tiele hiper defīnītive.
              </p>

              <p>
                Nk sola ēsperanÞiġo obl, mulÞō ipsilono nēdifīnita ien ed. Trīliono kōmpleksa co
                mil, kī āġā farī onin triǣnġulo. I eŭro postā eksteren eƿd, ig nūna viro
                īnstruītulo anc, gē īsm mēze ƿuancilo kīlometro. Ts rīlāte nekuÞima ðārǽlȝæjdō
                plue.
              </p>

              <p>
                Sēmi rolfinaĵo far nv, sūpēr sċivolema ǽfgænistāno kaj ej. LēÞēri frǽzmelodio eg
                plue, kiomæs sælutfrāzo ig hej. Korūso ekskluzive ǽnÞǣŭprīskrībo ȝo ena, ilī hā
                duonvokalō sekviƿȝēro. Lo esti adjēktivo duǣ, san simil multekostā iƿfinitīvo
                ēj. Is pakī rolfinaĵō sāt, kūƿ æl jaro sæmtempē, milo īmperǣtīvo ba ƿiǣ.
                Malebliġi esperantiġo pri rē, dum et duōno grupo sekstiliono.
              </p>

              <p>
                Fri ok ðekǣ hūrā, ho resÞi fīnāĵvorto substǽnÞivā ǽjn. Oz ūƿ&apos; mēġā
                okej&apos; perlæbori, ēl ǣŭ pobo līgvokālo, tio esÞiel finnlanðo il. Ad oƿī ðeko
                ālternaÞivǣ, i kvær fuÞuro tabelvorto iēl, veo mo mālpli alimǣnierē. Movi ilīard
                anÞāŭpǣrto īli om, sorī popolnomo prēpozīcīō ul tiē, prā mīria kurÞā
                praaƿtaŭhieraŭ lo.
              </p>

              <p>
                Prōto rōlfīnaĵo posÞpostmorgæŭ vol je, ve kelkē inkluzive siƿ. Ōmetr ġræðo
                ipsilōno ðū ǽto, iġi negi dēcilionō esperantigo æc, il unuo ulÞra aŭ. Milo fini
                iufoje dis be, ænt ēl hēkto hǣlÞōsÞreko, hot ab mēġā sūbfrǣzo. Rō āpuð kiloġrāmo
                mal, ties kromakċento iƿÞerogatīvo ot nur. Kunskribo profitænÞo prǽantæŭlǽsÞa ǣs
                plue, tǣgō tiūdirekten ni neā.
              </p>
            </div>
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
);

App.propTypes = {
  context: PropTypes.shape(ContextPropType),
};

export default App;
