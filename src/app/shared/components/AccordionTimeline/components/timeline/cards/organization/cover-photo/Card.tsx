/* eslint-disable camelcase */
import React from 'react';

import LocaleService from '@services/LocaleService';
import { dateToCalendar } from '@shared/helpers';
import CoverPhoto from '@shared/icons/CoverPhoto';
import { ImageType } from 'types';

import { BadgeType } from '../../../components/badge-type';

interface CardProps {
  cover_photo?: ImageType;
  started_at: Date;
  ended_at: Date;
}

function Card({ cover_photo, started_at, ended_at }: CardProps) {
  const i18n = LocaleService.getTranslations('accordionTimeline');

  return (
    <div className="organization-cover-photo-card">
      <div className="b6 date">
        {dateToCalendar(started_at)} - {ended_at !== null
          ? dateToCalendar(ended_at) : i18n.label.present}
      </div>
      <img src={cover_photo?.md} alt="" className="cover-photo" />
      <BadgeType icon={<CoverPhoto />} label="Cover Photo" />
    </div>
  );
}

export default Card;
