import classNames from 'classnames';
import React from 'react';
import { Button } from 'reactstrap';

import './StepProgress.scss';
import { CheckIcon } from '@shared/icons';

function StepProgress({ steps, currentStep, onChange }: {
  steps: number
  currentStep: number
  onChange: (step: number) => void
}) {
  return (
    <div className="step-progress my-5">
      {Array.from(Array(steps).keys()).map((v, i) => (
        <Button
          key={v}
          className={classNames({
            'p-0 step': true,
            active: i === currentStep,
            completed: currentStep > i,
          })}
          disabled={currentStep < i}
          onClick={() => onChange(i)}
        >
          {currentStep > i
            ? (
              <CheckIcon />
            )
            : (
              <span>{i + 1}</span>
            )}
        </Button>
      ))}
    </div>
  );
}

export default StepProgress;
