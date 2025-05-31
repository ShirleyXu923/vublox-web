import React from 'react';

import { dateToCalendar } from '@shared/helpers';
import { OrganizationIcon } from '@shared/icons';
import Ellipse from '@shared/icons/Ellipse';

interface OrganizationProps {
  onClick?: () => void;
  isActive?: boolean;
  data?: any;
  type?: string;
}

function OrganizationCard({
  onClick,
  isActive,
  data,
  type,
}: OrganizationProps) {
  return (
    <div
      onClick={onClick}
      className={`timeblock-container ${isActive ? 'active' : ''}`}
    >
      <div className="timestamp b6">{`${dateToCalendar(data?.started_at)} - ${data?.ended_at === null ? 'Present' : dateToCalendar(data?.ended_at)}`}</div>
      <div className="contents-container">
        <div className="logo">
          <img width={42} height={42} src={data?.cover_image?.md} alt="Logo" />
        </div>
        <div className="text">
          <div className="b2">{data?.name}</div>
          <div className="b5 text-truncate">{data?.description}</div>
          {/* Note: This line should be dynamic */}
          <div className="location caption1">
            <span>80M followers</span>
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
    </div>
  );
}

export default OrganizationCard;
