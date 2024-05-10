/* eslint-disable react/prop-types */
import React from 'react';
import { Scrolly, useWindowDimensions } from '@ft-interactive/vs-components';
import { deepCompareProps } from '@ft-interactive/vs-components/util';
// import LazyLoad from '../../util/LazyLoad.jsx';

import mapDataToSteps from '../../util/construct-scrolly-steps.jsx';

import { waypoints as sectionWaypoints, highlights } from './config.jsx';

const ScrollySection = ({ steps, sectionIdSuffix = '', context }) => {
  // const waypoints = useSteps(steps, mapWaypoints);
  const { isTablet } = useWindowDimensions();

  const waypoints = mapDataToSteps({
    docSteps: steps,
    waypoints: sectionWaypoints,
    highlights,
    isTablet,
    context,
  });

  return (
    <Scrolly
      scrollerId={`scrolly-${sectionIdSuffix}`}
      waypoints={waypoints}
      progress={false}
      threshold={4}
      offset={0.9}
      scrollToFirstStep
      bottomToTopScrollGaps
    >
      {/* Child scrolly figure goes here */}
    </Scrolly>
  );
};

export default React.memo(ScrollySection, deepCompareProps);
