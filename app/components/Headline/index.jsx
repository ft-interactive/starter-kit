/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';

import Bylines from '@financial-times/g-components/bylines';

import './styles.scss';

const Headline = ({ headline, topic, summary, className, bylines, ...props }) => {
  const buildTime = props.buildTime || new Date().toISOString(); // eslint-disable-line
  const publishedDate = props.publishedDate || new Date().toISOString(); // eslint-disable-line

  return (
    <div className={classNames('intro-content', className)}>
      <div className="intro-card-content">
        {topic && (
          <div className="topic">
            <a href={topic.url} className="o-editorial-typography-topic">
              {topic.name}
            </a>
          </div>
        )}
        <h1 className="o-editorial-layout-heading-1" itemProp="headline">
          {headline}
        </h1>
        {summary && <p className="o-editorial-typography-standfirst">{summary}</p>}

        {(bylines || publishedDate) && <Bylines names={bylines} date={publishedDate} />}
        <meta itemProp="dateModified" content={buildTime} suppressHydrationWarning />
      </div>
    </div>
  );
};

export default Headline;
