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

      const key = `${i}-${value}`;

      switch (type) {
        case 'text':
          return <Fragment key={key}>{insertSpans(value, linkSpans)}</Fragment>;
        case 'subhed':
          return <h2 key={key}>{value}</h2>;
        case 'video': {
          const videoConfig = VIDEOS[value];
          if (!videoConfig) return null;

          const { caption = "", videoSrc, image } = videoConfig;
          return (
            <InlineVideo
              media={{ videoSrc, image }}
              caption={caption}
              className="extra-margin"
              key={videoSrc}
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
              key={imageConfig.src}
            />
          );
        }
        default:
          // eslint-disable-next-line no-console
          console.warn("Unknown element type in 'text' list:", type);
          return null;
      }
    })}
  </div>
);

export default React.memo(BodyText);
