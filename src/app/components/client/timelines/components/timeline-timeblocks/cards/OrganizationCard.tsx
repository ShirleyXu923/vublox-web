import React from 'react';

import LocaleService from '@services/LocaleService';
import { dateToCalendar, shortNumberFormat } from '@shared/helpers';
import useAppTheme from '@shared/hooks/useAppTheme';
import { OrganizationIcon } from '@shared/icons';
import ArrowDown from '@shared/icons/ArrowDown';
import ArrowLeft from '@shared/icons/ArrowLeft';
import ArrowRight from '@shared/icons/ArrowRight';
import ArrowUp from '@shared/icons/ArrowUp';
import Ellipse from '@shared/icons/Ellipse';

interface OrganizationProps {
  onClick?: () => void;
  isActive?: boolean;
  data?: any;
  type?: string;
  onMove: (direction: string) => void;
}

function OrganizationCard({
  onClick,
  isActive,
  data,
  type,
  onMove,
}: OrganizationProps) {
  const i18n = LocaleService.getTranslations('createTimeline');
  const { logo } = useAppTheme();
  return (
    <div
      onClick={onClick}
      className={`timeblock-container ${isActive ? 'active' : ''}`}
    >
      <div className="timestamp b6">{`${dateToCalendar(data?.started_at)} - ${data?.ended_at === null ? 'Present' : dateToCalendar(data?.ended_at)}`}</div>
      <div className="contents-container">
        <div className="logo">
          <img width={42} height={42} src={data?.logo ? data?.logo?.md : logo} alt="Logo" style={{ objectFit: 'contain' }} />
        </div>
        <div className="text">
          <div className="b2">{data?.name}</div>
          <div className="b5 text-truncate">{data?.description}</div>
          {/* Note: This line should be dynamic */}
          <div className="location caption1">
            <span>
              {shortNumberFormat(
                data?.followers_count,
              )} {LocaleService.getPluralizedTranslation(
                i18n.label.follower,
                data?.followers_count || 0,
                false)}
            </span>
            {data?.location && (
              <span className="mx-2">
                <Ellipse />
              </span>
            )}
            <span>{data?.location?.name}</span>
          </div>
        </div>
      </div>
      <div className="actions">
        <div className="badges">
          <OrganizationIcon />
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

export default OrganizationCard;
