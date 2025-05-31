/* eslint-disable camelcase */
import React from 'react';

import GeneralMap from '@shared/components/Maps/GeneralMap';
import { dateToCalendar } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { LocationIcon } from '@shared/icons';
import { LocationType } from 'types';

import { BadgeType } from '../../../components/badge-type';

interface CardProps {
  location: LocationType;
  started_at: Date;
  ended_at: Date;
}

function Card({ location, started_at, ended_at }: CardProps) {
  const i18n = useTranslation('accordionTimeline');

  return (
    <div className="organization-bio-card">
      <div className="b6 date">
        {dateToCalendar(started_at)} - {ended_at !== null
          ? dateToCalendar(ended_at) : i18n.label.present}
      </div>
      <div className="location">
        <div className="map-title">{location?.name}</div>
        <GeneralMap
          countryCode={location?.country_code}
          latitude={+location.latitude || 0}
          longitude={+location.longitude || 0}
          containerStyle={{
            height: '375px',
            width: '100%',
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        />
      </div>
      <BadgeType icon={<LocationIcon />} label="Location" />
    </div>
  );
}

export default Card;
