import React, { useEffect, useRef, useState } from 'react';

import { ArrowDownIcon } from '@shared/icons';

import Pin from '../components/Pin';

interface TimelineItemProps {
  year?: string;
  onClick: () => void;
}

function TimelineItem({ onClick, year }: TimelineItemProps) {
  const ref = useRef<any>(null);
  const [ height, setHeight ] = useState(0);

  useEffect(() => {
    setHeight(ref.current?.clientHeight);
  }, []);

  return (
    <div className="timeline-item">
      {/* Pin Design */}
      <Pin height={height} />
      {/* Accordion Button */}
      <div className="accordion-cs" ref={ref}>
        <div className="s3">{year}</div>
        <div className="arrow" onClick={onClick}>
          <ArrowDownIcon />
        </div>
      </div>
    </div>
  );
}

export default TimelineItem;
