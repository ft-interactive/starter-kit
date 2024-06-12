import React from 'react';
import PropTypes from 'prop-types';

import {
  GridWrapperHelper,
  SideBySideImages,
  Image,
  InlineImage,
} from '@ft-interactive/vs-components';
import LazyLoad from '../../util/LazyLoad.jsx';
import BodyText from '../BodyText/index.jsx';
import ScrollySection from '../ScrollySection/index.jsx';

import images from '../../media/images';
import videos from '../../media/videos';

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
            <InlineImage
              fullGridWidth
              className="extra-margin"
              {...images[key]}
              {...component}
              key={key}
            />
          );
        case 'video':
          // eslint-disable-next-line no-console
          if (!videos[key]) console.warn('No video asset found for', key);
          return (
            <LazyLoad
              component={() => import('@ft-interactive/vs-components/InlineVideo')}
              props={{
                fullGridWidth: true,
                ...videos[key],
                ...component,
              }}
              loading={null}
              key={key}
            />
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
