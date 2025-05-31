import React from 'react';

import { dateToCalendar } from '@shared/helpers';
import TimelineIcon from '@shared/icons/TimelineIcon';

interface TimelineCardProps {
  isActive?: boolean;
  onClick?: () => void;
  data?: any
  type?: string;
}

function TimelineCard({
  isActive,
  onClick,
  type,
  data,
}: TimelineCardProps) {
  return (
    <div
      onClick={onClick}
      className={`timeblock-container ${isActive ? 'active' : ''}`}
    >
      <div className="timestamp b6">{dateToCalendar(data?.started_at)}</div>
      <div className="contents-container">
        <div className="image">
          <img width={116} src={data?.cover_image?.md} alt="Cover" />
        </div>
        <div className="text">
          <div className="b2">{data?.name}</div>
          <div className="description b5 text-truncate">{data?.description}</div>
          <div className="location caption1">{data?.location?.name}</div>
        </div>
      </div>
      <div className="actions">
        <div className="badges">
          <TimelineIcon />
          <span>{type}</span>
        </div>
      </div>
    </div>
  );
}

export default TimelineCard;
