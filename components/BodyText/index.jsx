import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import InlineWrapper from '@ft-interactive/vs-components/InlineWrapper';
import Image from '@ft-interactive/vs-components/Image';

import LazyLoad from '../../util/LazyLoad.jsx';
import { insertSpans } from '../../util/text.jsx';

import images from '../../assets/images';
import videos from '../../assets/videos';

import './styles.scss';

const BodyText = ({ elements, maxWidowSize = 8, extraMargin = true }) => (
  <div className="body-text o-editorial-layout-wrapper">
    {elements.map((component) => {
      const { type, value, spans = [] } = component;
      const key = value?.toLowerCase().trim().replace(' ', '-');

      const tSpans = spans.concat([
        {
          regex: new RegExp(`(\\w+\\s\\w{1,${maxWidowSize}}.?)$`),
          className: 'nowrap',
        },
      ]);

      switch (type) {
        case 'text':
          return <Fragment key={key}>{insertSpans(value, tSpans)}</Fragment>;
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
            <InlineWrapper
              className={classNames(
                'body-text__media',
                'body-text__media--video',
                extraMargin === true && 'extra-margin',
                component.float && `body-text__media--float-${component.float}`
              )}
              {...component}
              key={key}
            >
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
        }
        case 'inline-image': {
          // eslint-disable-next-line no-console
          if (!images[key]) console.warn('No video asset found for key', key);
          return (
            <InlineWrapper
              className={classNames(
                'body-text__media',
                'body-text__media--image',
                extraMargin === true && 'extra-margin',
                component.float && `body-text__media--float-${component.float}`
              )}
              {...component}
              key={key}
            >
              <Image
                sizes="(min-width: 1220px) 680px, (min-width: 740px) 70vw, 100vw"
                {...images[key]}
                {...component}
              />
            </InlineWrapper>
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
