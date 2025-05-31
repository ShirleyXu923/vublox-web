/* eslint-disable camelcase */
import React from 'react';

import LocaleService from '@services/LocaleService';
import { dateToCalendar } from '@shared/helpers';
import CoverPhoto from '@shared/icons/CoverPhoto';
import { ImageType } from 'types';

import { BadgeType } from '../../../components/badge-type';

interface CardProps {
  logo?: ImageType;
  started_at: Date;
  ended_at: Date;
}

function Card({ logo, started_at, ended_at }: CardProps) {
  const i18n = LocaleService.getTranslations('accordionTimeline');

  return (
    <div className="organization-logo-card">
      <div className="b6 date">
        {dateToCalendar(started_at)} - {ended_at !== null
          ? dateToCalendar(ended_at) : i18n.label.present}
      </div>
      <img src={logo?.md} alt="" className="logo" />
      <BadgeType icon={<CoverPhoto />} label="Logo" />
    </div>
  );
}

export default Card;
