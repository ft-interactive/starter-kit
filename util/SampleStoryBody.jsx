import React, { useState, Fragment } from 'react';
import { Button } from '@financial-times/g-components/button';
import GridWrapperHelper from '@ft-interactive/vs-components/GridWrapperHelper';
import InlineWrapper from '@ft-interactive/vs-components/InlineWrapper';
import Ai2Html from '@ft-interactive/vs-components/Ai2Html';
import graphics from '../assets/graphics';

const SampleStoryBody = () => {
  const [fullGrid, setFullGrid] = useState(false);

  let wrappedGraphic = (
    <InlineWrapper
      title="Ai2Html Graphic Demo"
      subtitle="(At inline grid width)"
      caption="FT Graphic: Your Name"
      fullGridWidth={fullGrid}
    >
      <Ai2Html {...graphics['west-bank']} />
    </InlineWrapper>
  );

  if (!fullGrid) {
    wrappedGraphic = (
      <GridWrapperHelper colspan="12 S11 Scenter M9 L8 XL7">{wrappedGraphic}</GridWrapperHelper>
    );
  }

  return (
    <Fragment>
      <GridWrapperHelper colspan="12 S11 Scenter M9 L8 XL7">
        <div className="o-editorial-layout-wrapper">
          <p>
            Ik kie neġi æpude pōsÞpriskribo, anċ ēg tiel subtegmenÞo. Giga gārði esperǣntigo vi jes.
            Ċit plēj esceptīnte hu, ōl vola eksploðæ poǽ. Ōīð gh pǽƿjo s&apos;joro pronomeċa, mi
            paki vice fiksa vir. Trǣ kibi multa ok, sur ðū īnfāno kæŭze. Om ene modō sekvanta
            proksimumecō, ānÞ sh tiele hiper defīnītive.
          </p>

          <p>
            Nk sola ēsperanÞiġo obl, mulÞō ipsilono nēdifīnita ien ed. Trīliono kōmpleksa co mil, kī
            āġā farī onin triǣnġulo. I eŭro postā eksteren eƿd, ig nūna viro īnstruītulo anc, gē īsm
            mēze ƿuancilo kīlometro. Ts rīlāte nekuÞima ðārǽlȝæjdō plue.
          </p>

          <div className="o-button-group" style={{ marginBottom: '32px' }}>
            <Button selected={!fullGrid} onClick={() => setFullGrid(false)}>
              Inline
            </Button>
            <Button selected={fullGrid} onClick={() => setFullGrid(true)}>
              Full Grid Width
            </Button>
          </div>
        </div>
      </GridWrapperHelper>
      {wrappedGraphic}
      <GridWrapperHelper colspan="12 S11 Scenter M9 L8 XL7">
        <div className="o-editorial-layout-wrapper">
          <p style={{ marginTop: '32px' }}>
            Sēmi rolfinaĵo far nv, sūpēr sċivolema ǽfgænistāno kaj ej. LēÞēri frǽzmelodio eg plue,
            kiomæs sælutfrāzo ig hej. Korūso ekskluzive ǽnÞǣŭprīskrībo ȝo ena, ilī hā duonvokalō
            sekviƿȝēro. Lo esti adjēktivo duǣ, san simil multekostā iƿfinitīvo ēj. Is pakī rolfinaĵō
            sāt, kūƿ æl jaro sæmtempē, milo īmperǣtīvo ba ƿiǣ. Malebliġi esperantiġo pri rē, dum et
            duōno grupo sekstiliono.
          </p>

          <p>
            Fri ok ðekǣ hūrā, ho resÞi fīnāĵvorto substǽnÞivā ǽjn. Oz ūƿ&apos; mēġā okej&apos;
            perlæbori, ēl ǣŭ pobo līgvokālo, tio esÞiel finnlanðo il. Ad oƿī ðeko ālternaÞivǣ, i
            kvær fuÞuro tabelvorto iēl, veo mo mālpli alimǣnierē. Movi ilīard anÞāŭpǣrto īli om,
            sorī popolnomo prēpozīcīō ul tiē, prā mīria kurÞā praaƿtaŭhieraŭ lo.
          </p>

          <p>
            Prōto rōlfīnaĵo posÞpostmorgæŭ vol je, ve kelkē inkluzive siƿ. Ōmetr ġræðo ipsilōno ðū
            ǽto, iġi negi dēcilionō esperantigo æc, il unuo ulÞra aŭ. Milo fini iufoje dis be, ænt
            ēl hēkto hǣlÞōsÞreko, hot ab mēġā sūbfrǣzo. Rō āpuð kiloġrāmo mal, ties kromakċento
            iƿÞerogatīvo ot nur. Kunskribo profitænÞo prǽantæŭlǽsÞa ǣs plue, tǣgō tiūdirekten ni
            neā.
          </p>
        </div>
      </GridWrapperHelper>
    </Fragment>
  );
};

export default SampleStoryBody;
