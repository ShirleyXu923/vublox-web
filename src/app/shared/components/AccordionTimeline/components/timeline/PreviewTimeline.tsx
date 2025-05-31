import React from 'react';

import './Timeline.scss';
import CardItem from './components/CardItem';

interface TimelineProps {
  timeblockables: any;
  onChangeVisibleItems?: ((isVisible: boolean, items: any[]) => void);
  timescale: string;
  query?: any;
}

function PreviewTimeline({
  timeblockables, onChangeVisibleItems, timescale = '', query = {},
}: TimelineProps) {
  const [ value, unit ] = timescale.split('-');

  return (
    <div className="timeline-accordion-container">
      {timeblockables.map((item: any, index: number) => (
        <CardItem
          key={item?.id || item?.type}
          item={item}
          open
          list={item.items}
          currentIndex={index}
          onChangeVisibleItems={onChangeVisibleItems}
          query={{ ...query, ts_value: value, ts_unit: unit }}
        />
      ))}

    </div>
  );
}

export default PreviewTimeline;
