import React from 'react';
import PropTypes from 'prop-types';

import GridWrapperHelper from '@ft-interactive/vs-components/GridWrapperHelper';
import SideBySideImages from '@ft-interactive/vs-components/SideBySideImages';
import Image from '@ft-interactive/vs-components/Image';
import InlineWrapper from '@ft-interactive/vs-components/InlineWrapper';
import Ai2Html from '@ft-interactive/vs-components/Ai2Html';

import LazyLoad from '../../util/LazyLoad.jsx';
import BodyText from '../BodyText/index.jsx';
import ScrollySection from '../ScrollySection/index.jsx';

import images from '../../assets/images';
import videos from '../../assets/videos';
import graphics from '../../assets/graphics';

const ArchieStoryBody = ({ bodyElements = [] }) => (
  <React.Fragment>
    {bodyElements.map((component) => {
      const type = component.type.toLowerCase();
      const value = component.value || component[component.type];
      const key = value?.toString().toLowerCase().trim().replace(' ', '-');

      switch (type) {
        case 'text':
          return (
            <GridWrapperHelper key={key} className="extra-margin">
              <BodyText elements={component.paras} />
            </GridWrapperHelper>
          );
        case 'flourish':
          return (
            <GridWrapperHelper key={key} className="extra-margin">
              {/* Need to lazy load in the flourish embed here. Without it, it never seems...
               ...to resize correctly on first load and so always has height of 600px  */}
              <LazyLoad
                component={() => import('@financial-times/g-components/flourish-embed')}
                props={{
                  url: component.flourish,
                  alt: component.alt ?? 'A flourish chart',
                  ...component,
                }}
                loading={null}
              />
            </GridWrapperHelper>
          );
        case 'side-by-side':
          // eslint-disable-next-line no-console
          if (!images[key]) console.warn('No image asset found for', key);
          if (!Array.isArray(images[key])) {
            // eslint-disable-next-line no-console
            console.warn('Side-by-side images should be named like <name>.0.jpg, <name>.1.jpg');
          }
          return (
            <SideBySideImages fullGridWidth caption="Tk tk © Tk tk" {...component} key={key}>
              {Array.isArray(images[key]) && images[key].map((img) => <Image {...img} />)}
            </SideBySideImages>
          );
        case 'image':
          // eslint-disable-next-line no-console
          if (!images[key]) console.warn('No image asset found for', key);
          return (
            <InlineWrapper fullGridWidth className="extra-margin" {...component} key={key}>
              <Image {...images[key]} {...component} />
            </InlineWrapper>
          );
        case 'graphic':
          // eslint-disable-next-line no-console
          if (!graphics[key]) console.warn('No ai2html asset found for', key);
          return (
            <InlineWrapper fullGridWidth className="extra-margin" {...component} key={key}>
              <Ai2Html {...graphics[key]} {...component} />
            </InlineWrapper>
          );
        case 'video':
          // eslint-disable-next-line no-console
          if (!videos[key]) console.warn('No video asset found for', key);
          return (
            <InlineWrapper fullGridWidth className="extra-margin" {...component} key={key}>
              <LazyLoad
                component={() => import('@ft-interactive/vs-components/Video')}
                props={{
                  ...videos[key],
                  ...component,
                }}
                loading={null}
                key={key}
              />
            </InlineWrapper>
          );
        case 'scrolly':
          /** At the moment this is setup to use an ID (which is set in getArchieDoc.js).
           * Which means if you switch the positions of the scrolly's in the google doc you'll
           * also need to update this */
          return <ScrollySection steps={component.steps} key={key} />;
        default:
          // eslint-disable-next-line no-console
          console.warn('Unknown ArchieML type:', type);
          return null;
      }
    })}
  </React.Fragment>
);

ArchieStoryBody.propTypes = {
  bodyElements: PropTypes.arrayOf(PropTypes.shape({})),
};

export default ArchieStoryBody;
