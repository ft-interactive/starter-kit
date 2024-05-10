import React from 'react';
import { Card } from '@ft-interactive/vs-components';

import { insertSpans } from './text.jsx';
import Headline from '../components/Headline/index.jsx';

const constructScrollySteps = ({
  docSteps,
  waypoints = [],
  highlights = [],
  context = {},
  isTablet = false,
  wideCards = false,
}) =>
  docSteps.map((step, i) => {
    const matchingWaypoint = waypoints[i] || {};
    const cardAlignment = isTablet ? 'center' : step.figure || 'left';

    const stepHighlights = highlights.filter(
      (d) => typeof d.stepIndex === 'undefined' || d.stepIndex === i
    );
    const innerHtml = insertSpans(step.cards[0]?.text, stepHighlights) || '';

    // check for overrides on the vertical alignment for this step or scrolly gap size for this step in the waypoints data
    // (e.g. on multi-card steps where you want a smaller gap than for single-card steps in the same section)
    const { stepVerticalAlignment = null, stepGapSize = null } = matchingWaypoint;

    return {
      step: i,
      ...matchingWaypoint,
      stepVerticalAlignment,
      stepGapSize,
      content:
        step.figure === 'headline' ? (
          <Headline {...context} />
        ) : (
          <Card cardAlignment={cardAlignment} background="light" shadow wide={wideCards}>
            {innerHtml}
          </Card>
        ),
    };
  });

export default constructScrollySteps;
