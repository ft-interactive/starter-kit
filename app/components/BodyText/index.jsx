import React, { Fragment } from 'react';
import { InlineVideo, InlineImage } from '@ft-interactive/vs-components';
import { insertSpans } from '../../util/text.jsx';

import './styles.scss';

const VIDEOS = {};

const IMAGES = {};

const BodyText = ({ elements }) => (
  <div className="body-text o-editorial-layout-wrapper">
    {elements.map(({ type, value, caption, links = [] }, i) => {
      const linkSpans = links.map(({ str, url }) => ({
        text: str,
        element: 'a',
        props: { href: url, target: '_blank' },
      }));
      /* eslint-disable react/no-array-index-key */
      switch (type) {
        case 'text':
          return <Fragment key={i}>{insertSpans(value, linkSpans)}</Fragment>;
        case 'subhed':
          return <h2 key={i}>{value}</h2>;
        case 'video': {
          const videoConfig = VIDEOS[value];
          if (!videoConfig) return null;
          return (
            <InlineVideo
              media={{ videoSrc: videoConfig.videoSrc, image: videoConfig.image }}
              caption="Footage from a drone attacking a Russian Navy Vessel in October 2022. Source: @Conflicts"
              className="extra-margin"
              key={`video-${videoConfig.videoSrc}`}
            />
          );
        }
        case 'image': {
          const imageConfig = IMAGES[value];
          if (!imageConfig) return null;
          return (
            <InlineImage
              fullGridWidth={false}
              src={imageConfig.src}
              alt={imageConfig.alt}
              caption={imageConfig.caption}
              className="extra-margin"
              imageService={import.meta.env.MODE === 'production'}
              key={`image-${imageConfig.src}`}
            />
          );
        }
        default:
          // eslint-disable-next-line no-console
          console.warn("Unknown element type in 'text' list:", type);
          return null;
      } /* eslint-enable react/no-array-index-key */
    })}
  </div>
);

export default React.memo(BodyText);
