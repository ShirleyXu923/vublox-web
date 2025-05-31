import moment from 'moment';
import React from 'react';

import RangeSlider from '@shared/components/RangeSlider/RangeSlider';

import './TimelineSlider.scss';

function TimelineSlider({
  startedAt,
  endedAt,
  onSelectTimeRange,
}: {
  startedAt: Date | string;
  endedAt: Date | string;
  onSelectTimeRange: (data: any) => void;
}) {
  const max = moment(endedAt).diff(moment(startedAt), 'days');

  return (
    <div className="d-flex align-items-center timeline-slider container">
      <p className="text mb-0 pr-1 small">
        {moment(startedAt).format('MMM DD, YYYY')}
      </p>
      <div className="w-100 px-3">
        <RangeSlider
          startDate={startedAt}
          max={max}
          maxValue={max}
          onSelectTimeRange={onSelectTimeRange}
        />
      </div>
      <p className="text mb-0 pl-1 small">
        {moment(endedAt || startedAt).format('MMM DD, YYYY')}
      </p>
    </div>
  );
}

export default TimelineSlider;
