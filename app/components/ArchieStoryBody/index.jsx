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
import ScrollySection from '../../sections/ScrollySection/index.jsx';

import SampleSideBySide1 from '../../media/images/sample_images/SampleSideBySide1.jpg';
import SampleSideBySide2 from '../../media/images/sample_images/SampleSideBySide2.jpg';

import SampleDesktop from '../../media/images/sample_images/SampleDesktop.png';
import SampleMid from '../../media/images/sample_images/SampleMid.png';
import SampleMobile from '../../media/images/sample_images/SampleMobile.png';

import SampleVideo from '../../media/video/sample_video.mp4';
import SampleVideoMobile from '../../media/video/sample_video_mobile.mp4';

import SampleVideoFallback from '../../media/images/sample_images/sample_video_fallback.png';
import SampleVideoFallbackMobile from '../../media/images/sample_images/sample_video_fallback_mobile.png';

const ArchieStoryBody = ({ bodyElements = [] }) => (
  <React.Fragment>
    {bodyElements.map((component, i) => {
      const type = component.type.toLowerCase();
      /* eslint-disable react/no-array-index-key */
      switch (type) {
        case 'text':
          return (
            <GridWrapperHelper key={i} className="extra-margin">
              <BodyText elements={component.paras} />
            </GridWrapperHelper>
          );
        case 'subhed':
          return <h2 key={i}>{component.value}</h2>;
        case 'flourish':
          return (
            <GridWrapperHelper key={i} className="extra-margin">
              {/* Need to lazy load in the flourish embed here. Without it, it never seems...
               ...to resize correctly on first load and so always has height of 600px  */}
              <LazyLoad
                component={() => import('@financial-times/g-components/flourish-embed')}
                props={{
                  url: component.flourish,
                  alt: component.alt ?? 'A flourish chart',
                }}
                loading={null}
              />
            </GridWrapperHelper>
          );
        case 'side-by-side':
          return (
            <div className="extra-margin">
              <SideBySideImages fullGridWidth>
                <Image
                  src={component[type] === 'sample' ? SampleSideBySide1 : ''}
                  imageService={import.meta.env.MODE === 'production'}
                  alt=""
                  maxAutoSrcWidth={1500}
                />
                <Image
                  src={component[type] === 'sample' ? SampleSideBySide2 : ''}
                  imageService={import.meta.env.MODE === 'production'}
                  alt=""
                  maxAutoSrcWidth={1500}
                />
              </SideBySideImages>
              <InlineImage fullGridWidth caption="Tk tk © Tk tk" />
            </div>
          );
        case 'image':
          return (
            <InlineImage
              fullGridWidth
              sources={
                component[type] === 'sample'
                  ? {
                      large: SampleDesktop,
                      medium: SampleMid,
                      small: SampleMobile,
                    }
                  : { large: '', medium: '', small: '' }
              }
              className="extra-margin"
              imageService={import.meta.env.MODE === 'production'}
              alt="Tk tk"
            />
          );
        case 'video':
          return (
            <GridWrapperHelper key={i} className="extra-margin">
              <LazyLoad
                component={() => import('@ft-interactive/vs-components/InlineVideo')}
                props={{
                  media: { videoSrc: SampleVideo },
                  mediaMobile: { videoSrc: SampleVideoMobile },
                  image: {
                    sources: {
                      small: SampleVideoFallbackMobile,
                      medium: SampleVideoFallback,
                      large: SampleVideoFallback,
                    },
                    alt: 'Tk tk',
                  },
                  loop: true,
                  showControls: true,
                  includeSound: false,
                }}
                loading={null}
              />
            </GridWrapperHelper>
          );
        case 'scrolly':
          /** At the moment this is setup to use an ID (which is set in getArchieDoc.js).
           * Which means if you switch the positions of the scrolly's in the google doc you'll
           * also need to update this */
          return <ScrollySection steps={component.steps} />;
        default:
          // eslint-disable-next-line no-console
          console.warn('Unknown ArchieML type:', component.type);
          return null;
      }
      /* eslint-enable react/no-array-index-key */
    })}
  </React.Fragment>
);

ArchieStoryBody.propTypes = {
  bodyElements: PropTypes.arrayOf(PropTypes.shape({})),
};

export default ArchieStoryBody;
