import React from 'react';

import LocaleService from '@services/LocaleService';
import { dateToCalendar } from '@shared/helpers';
import useAppTheme from '@shared/hooks/useAppTheme';
import ArrowDown from '@shared/icons/ArrowDown';
import ArrowLeft from '@shared/icons/ArrowLeft';
import ArrowRight from '@shared/icons/ArrowRight';
import ArrowUp from '@shared/icons/ArrowUp';
import TimelineIcon from '@shared/icons/TimelineIcon';

interface TimelineCardProps {
  isActive?: boolean;
  onClick?: () => void;
  data?: any
  type?: string;
  onMove: (direction: string) => void;
}

function TimelineCard({
  isActive,
  onClick,
  type,
  data,
  onMove,
}: TimelineCardProps) {
  const i18n = LocaleService.getTranslations('createTimeline');
  const { logo } = useAppTheme();
  return (
    <div
      onClick={onClick}
      className={`timeblock-container ${isActive ? 'active' : ''}`}
    >
      <div className="timestamp b6">{dateToCalendar(data?.started_at)}</div>
      <div className="contents-container">
        <div className="image">
          <img width={116} src={data?.cover_image ? data?.cover_image?.md : logo} alt="Cover" style={{ objectFit: 'contain' }} />
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
      {isActive && type !== 'Parent Timeline' && (
        <div className="buttons">
          <button type="button" className="button caption1" onClick={() => onMove('right')}>
            <ArrowRight />
            {i18n.button.moveRight}
          </button>
          <button type="button" className="button caption1" onClick={() => onMove('left')}>
            <ArrowLeft />
            {i18n.button.moveLeft}
          </button>
          <button type="button" className="button caption1" onClick={() => onMove('up')}>
            <ArrowUp />
            {i18n.button.moveUp}
          </button>
          <button type="button" className="button caption1" onClick={() => onMove('down')}>
            <ArrowDown />
            {i18n.button.moveDown}
          </button>
        </div>
      )}
    </div>
  );
}

export default TimelineCard;
