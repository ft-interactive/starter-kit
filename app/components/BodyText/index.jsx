import React, { Fragment } from 'react';
import { InlineVideo, InlineImage } from '@ft-interactive/vs-components';
import { insertSpans } from '../../util/text.jsx';
import PropTypes from 'prop-types'; 
import classNames from 'classnames';

import './styles.scss';

const VIDEOS = {};

const IMAGES = {};

const BodyText = ({ elements, maxWidowSize = 8, extraMargin = true }) => (
  <div className="body-text o-editorial-layout-wrapper">
    {elements.map(({ type, value, caption, links = [] }, i) => {
      const linkSpans = links.map(({ str, url }) => ({
        text: str,
        element: 'a',
        props: { href: url, target: '_blank' },
      }))
      .concat([
        {
          regex: new RegExp("(\w+\s\w{1," + maxWidowSize + "}.?)$"),
          className: 'nowrap',
        },
      ]);

      const key = `${i}-${value}`;

      switch (type) {
        case 'text':
          return <Fragment key={key}>{insertSpans(value, linkSpans)}</Fragment>;
        case 'subhed':
          return <h2 key={key} className={classNames("body-text__header")}>{value}</h2>;
        case 'video': {
          const videoConfig = VIDEOS[value];
          if (!videoConfig) return null;

          const { caption = "", videoSrc, image } = videoConfig;
          return (
            <InlineVideo
              media={{ videoSrc, image }}
              caption={caption}
              className={classNames("body-text__media", "body-text__media--video", extraMargin === true && "extra-margin")}
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
              className={classNames("body-text__media", "body-text__media--image", extraMargin === true && "extra-margin")}
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

BodyText.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({})),
  maxWidowSize: PropTypes.number,
  extraMargin: PropTypes.bool
}

export default React.memo(BodyText);
