/* eslint-disable camelcase */
import React from 'react';

import LocaleService from '@services/LocaleService';
import { dateToCalendar } from '@shared/helpers';
import Bio from '@shared/icons/Bio';

import { BadgeType } from '../../../components/badge-type';

interface CardProps {
  id?: string;
  name?: string;
  started_at: Date;
  ended_at: Date;
}

function Card({
  id,
  name,
  started_at,
  ended_at,
}: CardProps) {
  const i18n = LocaleService.getTranslations('accordionTimeline');

  return (
    <div className="organization-name-card" id={id}>
      <div className="b6 date">
        {dateToCalendar(started_at)} - {ended_at !== null
          ? dateToCalendar(ended_at) : i18n.label.present}
      </div>
      <div className="b2">{name}</div>
      <BadgeType icon={<Bio />} label="Name" />
    </div>
  );
}

export default Card;
