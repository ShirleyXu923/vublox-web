import React from 'react';

import EventCard from './cards/EventCard';
import OrganizationCard from './cards/OrganizationCard';
import TimelineCard from './cards/TimelineCard';

interface TimeCardProps {
  isRoot?: boolean;
  badge?: string;
  isActive?: boolean;
  onClick?: () => void;
  data?: any
  onMove: (direction: string) => void;
}

function TimeCard({
  isRoot,
  isActive,
  badge = 'Timeline',
  data,
  onClick,
  onMove,
}: TimeCardProps) {
  const getTimeblockCard = () => {
    let card = null;
    if (badge === 'Timeline' || badge === 'Parent Timeline') {
      card = (
        <TimelineCard
          onClick={onClick}
          type={badge}
          data={data}
          isActive={isActive}
          onMove={onMove}
        />
      );
    }

    if (badge === 'Organization') {
      card = (
        <OrganizationCard
          onClick={onClick}
          type={badge}
          data={data}
          isActive={isActive}
          onMove={onMove}
        />
      );
    }

    if (badge === 'Event') {
      card = (
        <EventCard
          onClick={onClick}
          type={badge}
          data={data}
          isActive={isActive}
          onMove={onMove}
        />
      );
    }

    return card;
  };

  return (
    <div className="timeblock-wrapper timeblock-card">
      <div className="line last-line" />
      {!isRoot && <div className="extender-top" />}
      <div className="extender-bottom" />
      <div className="fade-extender" />
      {getTimeblockCard()}
    </div>
  );
}

export default TimeCard;
