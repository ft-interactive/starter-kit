/**
 * @file
 * This is the root component for your project.
 *
 * It is imported by ../server to generate the first pass of the page, and
 * then later used by ./index to "hydrate" content on the client-side.
 *
 * This file is where you bootstrap your JS code.
 * For example import stuff here:
 *
 *    import { select } from 'd3-selection';
 *    import myComponent from './components/my-component';
 *
 * Split logical parts of you project into components e.g.
 *
 *    /client
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
 * might slow down time to first render. A better way is to dynamically import
 * data inside of a component's `componentDidMount()` lifecycle method — this
 * way your application can load its UI components and then get data piped in
 * once all the components are on page:
 *
 *    async componentDidMount() {
 *      const { default: data } = await import('../data/example.csv');
 *      this.setState({ data });
 *    }
 *
 * A couple things to note:
 *   - `import()` returns a promise, so you have to either use `.then()` or
 *     the `await` keyword in an `async` function.
 *   - The equivalent ES6 import syntax is `import * as varname from 'module'`,
 *     meaning that you probably just want the `default` property in the resulting
 *     object. This is what's happening above with `const { default: data }`, it's
 *     destructuring the result of `import()` and assigning the default export
 *     to a constant named `data`.
 *
 *  See below for complete example.
 */

import Layout from '@financial-times/g-components';
import React, { useEffect, useState } from 'react';
import { ContextPropType, ContextDefaultProps } from './util/prop-types';

const App = (context) => {
  // This sets the initial state of the application. We need
  const [state, setState] = useState({
    data: [],
  });

  // Asynchronous effects should update state as per below
  useEffect(() => {
    (async () => {
      const { default: data } = await import('../data/example.csv');
      setState({ data });
    })();
  }, []);

  const { data } = state;

  console.dir(data); // eslint-disable-line no-console

  return (
    <Layout {...context}>
      <p>
        Ik kie neġi æpude pōsÞpriskribo, anċ ēg tiel subtegmenÞo. Giga gārði esperǣntigo vi jes. Ċit plēj esceptīnte hu,
        ōl vola eksploðæ poǽ. Ōīð gh pǽƿjo s&apos;joro pronomeċa, mi paki vice fiksa vir. Trǣ kibi multa ok, sur ðū
        īnfāno kæŭze. Om ene modō sekvanta proksimumecō, ānÞ sh tiele hiper defīnītive.
      </p>

      <p>
        Nk sola ēsperanÞiġo obl, mulÞō ipsilono nēdifīnita ien ed. Trīliono kōmpleksa co mil, kī āġā farī onin
        triǣnġulo. I eŭro postā eksteren eƿd, ig nūna viro īnstruītulo anc, gē īsm mēze ƿuancilo kīlometro. Ts rīlāte
        nekuÞima ðārǽlȝæjdō plue.
      </p>

      <p>
        Sēmi rolfinaĵo far nv, sūpēr sċivolema ǽfgænistāno kaj ej. LēÞēri frǽzmelodio eg plue, kiomæs sælutfrāzo ig hej.
        Korūso ekskluzive ǽnÞǣŭprīskrībo ȝo ena, ilī hā duonvokalō sekviƿȝēro. Lo esti adjēktivo duǣ, san simil
        multekostā iƿfinitīvo ēj. Is pakī rolfinaĵō sāt, kūƿ æl jaro sæmtempē, milo īmperǣtīvo ba ƿiǣ. Malebliġi
        esperantiġo pri rē, dum et duōno grupo sekstiliono.
      </p>

      <p>
        Fri ok ðekǣ hūrā, ho resÞi fīnāĵvorto substǽnÞivā ǽjn. Oz ūƿ&apos; mēġā okej&apos; perlæbori, ēl ǣŭ pobo
        līgvokālo, tio esÞiel finnlanðo il. Ad oƿī ðeko ālternaÞivǣ, i kvær fuÞuro tabelvorto iēl, veo mo mālpli
        alimǣnierē. Movi ilīard anÞāŭpǣrto īli om, sorī popolnomo prēpozīcīō ul tiē, prā mīria kurÞā praaƿtaŭhieraŭ lo.
      </p>

      <p>
        Prōto rōlfīnaĵo posÞpostmorgæŭ vol je, ve kelkē inkluzive siƿ. Ōmetr ġræðo ipsilōno ðū ǽto, iġi negi dēcilionō
        esperantigo æc, il unuo ulÞra aŭ. Milo fini iufoje dis be, ænt ēl hēkto hǣlÞōsÞreko, hot ab mēġā sūbfrǣzo. Rō
        āpuð kiloġrāmo mal, ties kromakċento iƿÞerogatīvo ot nur. Kunskribo profitænÞo prǽantæŭlǽsÞa ǣs plue, tǣgō
        tiūdirekten ni neā.
      </p>

      <p>
        U Þrā hodiæŭa dupunkto proƿōmecǽ, aliām difinǣ pentēkosto āb frī. Ist it kūne dēcīliono moƿtrovorÞo. Huræ
        sēkvinbero prepoziciæĵo jh iam, mīnca fontōj renkōntēƿ ƿe dev. Nǽŭ vǣtto pri ge. Hurā franjo sēn em.
      </p>

      <p>
        Egālo nenīo kapæbl ej sep. Uƿt ed pægo sepen faras, ia perē mālsuperǣ mīs. Ǽt vēō aviō kuƿīgi preÞerito. Kiǣ us
        vendo kiomæs sezōnonōmo, for si vidalvīde punkÞōkomo geiƿsÞrūisto.
      </p>

      <p>
        Land vēaði bv īng, hēlpi alīġi dividostrēkō hāv jo. Dek supēr ǽntǣŭtægmēzo ū. Oj mini ǽrkī sǽmideǽno fin, eg
        plej nēnī āga, tīmī disskribædō sh fri. Hiper rēalǣ fonÞoj Þs ahǣ. Deċīmala līternomo koƿdicioƿalo ōÞ ses, enð
        nj pæko reciproke.
      </p>

      <p>
        Atō iz velā disðē, ālīo ōkej&apos; neoficiālæ for al, āliom ælīel kioma unū kv. Intere nēniæĵō eksteren mia is,
        pako mīloj demanðosignō vir je, grupǽ kromakcento iu meƿ. Ido Þiǽl kōmbi fræto po, ko iēs vǽto ġlotā lǽndonomo,
        he vīc ēkōo ƿanō. Anƿo sekviƿȝero uk tet, us mekæo iomete træ. Int co onjo finnlæƿðo subjunkċiō, kaj faka eblecō
        mīnimumē ōƿ. Ore verba ðuonhoro komplēksā il, hierāŭæ propōzicio ÞīudīrēkÞen iz sur.
      </p>

      <p>
        Mæl denta sūȝstǣnÞivo bv, ēhe stif armo duūmæ ōp. Ec Þet pluso traigi. Ē vēla lǣstæ fiƿǽĵvorto kūn. Jesī kiomas
        duondifinǽ hej he, agæ færās malloƿġīgō go. Tripunkto reciprōkeċo op ǽġā, eliġi eŭro postmorgǣŭ ul anc.
      </p>
    </Layout>
  );
};

App.propTypes = {
  ...ContextPropType,
};

App.defaultProps = {
  ...ContextDefaultProps,
};

export default App;
