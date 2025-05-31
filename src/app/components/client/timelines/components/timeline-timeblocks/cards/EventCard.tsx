import React from 'react';
import { NavLink } from 'react-router-dom';

import LocaleService from '@services/LocaleService';
import { dateToCalendar, getProfileLink } from '@shared/helpers';
import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';
import ArrowDown from '@shared/icons/ArrowDown';
import ArrowLeft from '@shared/icons/ArrowLeft';
import ArrowRight from '@shared/icons/ArrowRight';
import ArrowUp from '@shared/icons/ArrowUp';
import EventIcon from '@shared/icons/EventIcon';

interface EventCardProps {
  onClick?: () => void;
  isActive?: boolean;
  data?: any;
  type?: string;
  onMove: (direction: string) => void;
}

function EventCard({
  onClick,
  isActive,
  data,
  type,
  onMove,
}: EventCardProps) {
  const i18n = LocaleService.getTranslations('createTimeline');
  const i18nHome = useTranslation('home');
  const { logo } = useAppTheme();
  return (
    <div
      onClick={onClick}
      className={`timeblock-container ${isActive ? 'active' : ''}`}
    >
      <div className="timestamp b6">{`${dateToCalendar(data?.started_at)} - ${data?.ended_at === null ? 'Present' : dateToCalendar(data?.ended_at)}`}</div>
      <div className="contents-container">
        <div className="image">
          <img width={116} src={data?.banner_url ? data?.banner_url?.md : logo} alt="Cover" style={{ objectFit: 'contain' }} />
        </div>
        <div className="text">
          <div className="b2">{data?.name}</div>
          <div className="description b5 text-truncate">{data?.description}</div>
          <div className="caption1">{data?.location?.name}</div>

          <div className="caption1">
            {i18nHome.label.organizedBy}&nbsp;

            <NavLink key={data.owner?.id} to={getProfileLink(data.owner)} className="link" target="_blank">
              {data.owner?.name || data.owner?.display_name }
            </NavLink>
            {data.coCreators.length > 0 && ', '}
            {data.coCreators.map((c: any, index: number) => (
              <>
                <NavLink key={c?.creator?.id} to={c?.creator?.link} className="link" target="_blank">
                  {c?.creator?.name}
                </NavLink>
                {index < data.coCreators.length - 1 && ', '}
              </>
            ))}
          </div>
        </div>
      </div>
      <div className="actions">
        <div className="badges">
          <EventIcon />
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

export default EventCard;
