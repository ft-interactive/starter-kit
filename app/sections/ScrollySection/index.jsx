/* eslint-disable react/prop-types */
import React from 'react';
import { Scrolly } from '@ft-interactive/vs-components';
import { deepCompareProps } from '@ft-interactive/vs-components/util';
// import LazyLoad from '../../util/LazyLoad.jsx';

import mapDataToSteps from '../../util/map-data-to-steps.jsx';

import { waypoints as sectionWaypoints, highlights } from './config.jsx';
import ScrollyFigure from '../../components/ScrollyFigure/index.jsx';

const ScrollySection = ({ steps, sectionIdSuffix = '', context }) => {
  const waypoints = mapDataToSteps({
    docSteps: steps,
    waypoints: sectionWaypoints,
    highlights,
    context,
  });

  return (
    <Scrolly
      scrollerId={`scrolly-${sectionIdSuffix}`}
      waypoints={waypoints}
      progress
      threshold={4}
      offset={0.9}
      scrollToFirstStep
      bottomToTopScrollGaps
    >
      {/* Child scrolly figure goes here. Replace or adapt this example component: */}
      <ScrollyFigure />
    </Scrolly>
  );
};

export default React.memo(ScrollySection, deepCompareProps);
