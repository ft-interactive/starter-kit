import React from 'react';
import classNames from 'classnames';
import { useScrollyContext } from '@ft-interactive/vs-components';

import './styles.scss';

const ScrollyFigure = ({}) => {
  const { activeStep, stepProgress } = useScrollyContext();

  return (
    <div className={classNames('vs-sample-scrolly-figure__wrapper')}>
      <div className={classNames('vs-sample-scrolly-figure__step-counter')}>
        Scroll progress:{' '}
        <span className="vs-sample-scrolly-figure__value-span">
          {(activeStep + stepProgress).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default ScrollyFigure;
