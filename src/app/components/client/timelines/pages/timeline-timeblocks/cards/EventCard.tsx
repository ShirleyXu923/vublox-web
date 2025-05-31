import React from 'react';
import { NavLink } from 'react-router-dom';

import { dateToCalendar, getProfileLink } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import EventIcon from '@shared/icons/EventIcon';

interface EventCardProps {
  onClick?: () => void;
  isActive?: boolean;
  data?: any;
  type?: string;
}

function EventCard({
  onClick,
  isActive,
  data,
  type,
}: EventCardProps) {
  const i18n = useTranslation('home');
  return (
    <div
      onClick={onClick}
      className={`timeblock-container ${isActive ? 'active' : ''}`}
    >
      <div className="timestamp b6">{`${dateToCalendar(data?.started_at)} - ${data?.ended_at === null ? 'Present' : dateToCalendar(data?.ended_at)}`}</div>
      <div className="contents-container">
        <div className="image">
          <img width={116} src={data?.cover_image?.md} alt="Cover" />
        </div>
        <div className="text">
          <div className="b2">{data?.name}</div>
          <div className="description b5 text-truncate">{data?.description}</div>
          {data?.location && (
            <NavLink to={`/locations/${data.location.slug}`} target="_blank">
              <div className="caption1">{data?.location?.name}</div>
            </NavLink>
          )}

          <div className="caption1">
            {i18n.label.organizedBy}&nbsp;
            <NavLink key={data.owner?.id} to={getProfileLink(data.owner)} className="link" target="_blank">
              {data.owner?.name || data.owner?.display_name }
            </NavLink>
            {data.coCreators.length > 0 && ', '}
            {data.coCreators.map((c: any, index: number) => (
              <>
                <a key={c.id} href={`/organizations/${c.organization?.id}`} className="link" target="_blank" rel="noopener noreferrer">
                  {c.display_name || c.organization?.name}
                </a>
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
    </div>
  );
}

export default EventCard;
