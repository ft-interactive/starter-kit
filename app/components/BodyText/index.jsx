import React, { Fragment } from 'react';
import InlineImage from '@ft-interactive/vs-components/InlineImage';
import InlineVideo from '@ft-interactive/vs-components/InlineVideo';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { insertSpans } from '../../util/text.jsx';

import images from '../../media/images';
import videos from '../../media/videos';

import './styles.scss';

const BodyText = ({ elements, maxWidowSize = 8, extraMargin = true }) => (
  <div className="body-text o-editorial-layout-wrapper">
    {elements.map((component) => {
      const { type, value, links = [] } = component;
      const key = value?.toLowerCase().trim().replace(' ', '-');

      const linkSpans = links
        .map(({ str, url }) => ({
          text: str,
          element: 'a',
          props: { href: url, target: '_blank' },
        }))
        .concat([
          {
            regex: new RegExp(`(\w+\s\w{1,${maxWidowSize}}.?)$`),
            className: 'nowrap',
          },
        ]);

      switch (type) {
        case 'text':
          return <Fragment key={key}>{insertSpans(value, linkSpans)}</Fragment>;
        case 'subhed':
          return (
            <h2 className={classNames('body-text__header')} key={key}>
              {value}
            </h2>
          );
        case 'inline-video': {
          // eslint-disable-next-line no-console
          if (!videos[key]) console.warn('No image asset found for key', key);

          return (
            <InlineVideo
              className={classNames(
                'body-text__media',
                'body-text__media--video',
                extraMargin === true && 'extra-margin',
                component.float && `body-text__media--float-${component.float}`
              )}
              {...videos[key]}
              image={{
                sizes: '(min-width: 1220px) 680px, (min-width: 740px) 70vw, 100vw',
                ...videos[key].image,
              }}
              {...component}
              key={key}
            />
          );
        }
        case 'inline-image': {
          // eslint-disable-next-line no-console
          if (!images[key]) console.warn('No video asset found for key', key);

          return (
            <InlineImage
              className={classNames(
                'body-text__media',
                'body-text__media--image',
                extraMargin === true && 'extra-margin',
                component.float && `body-text__media--float-${component.float}`
              )}
              sizes="(min-width: 1220px) 680px, (min-width: 740px) 70vw, 100vw"
              {...images[key]}
              {...component}
              key={key}
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
  extraMargin: PropTypes.bool,
};

export default React.memo(BodyText);
