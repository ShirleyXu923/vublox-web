import React from 'react';

import TimelinePin from '@shared/icons/TimelinePin';

import './Pin.scss';

interface PinProps {
  withExtender?: boolean;
  height: number;
}

function Pin({ withExtender, height }: PinProps) {
  const getHeight = () => height - 33;

  return (
    <div className="pin">
      {withExtender && <div className="line-t" />}
      <div className="circle-container">
        <TimelinePin />
      </div>
      <div className="line-b" style={{ height: `${getHeight()}px` }} />
      {withExtender && (
        <div className="shadow" />
      )}
    </div>
  );
}

export default Pin;
