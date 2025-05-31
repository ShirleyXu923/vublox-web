/* eslint-disable camelcase */
import React from 'react';
import { Link } from 'react-router-dom';

import { dateToCalendar } from '@shared/helpers';
import { ArrowDownIcon } from '@shared/icons';
import TimelineIcon from '@shared/icons/TimelineIcon';
import ImagePlaceholder from '@shared/utils/ImagePlaceholder/ImagePlaceholder';
import { ImageType, LocationType } from 'types';

import { BadgeType } from '../../components/badge-type';

interface CardProps {
  id?: string;
  name?: string;
  description?: string;
  started_at: Date;
  location: LocationType;
  cover_image: ImageType;
}

function Card({
  id,
  name,
  description,
  started_at,
  location,
  cover_image,
}: CardProps) {
  return (
    <div className="timeline-card">
      <div className="header">
        <div className="b6 date">{dateToCalendar(started_at)}</div>
        <ArrowDownIcon />
      </div>
      <div className="body">
        <Link to={`/timelines/${id}`}>
          {cover_image ? (
            <img className="image" src={cover_image?.md} width="100%" height="100%" alt="Banner" />
          ) : (
            <ImagePlaceholder className="image" width="50%" />
          )}
        </Link>
        <div className="informative">
          <Link to={`/timelines/${id}`} className="b2 title">{name}</Link>
          <div className="b5 description">{description}</div>
          <div className="caption1 location">{location?.name}</div>
        </div>
      </div>
      <div className="footer">
        <BadgeType icon={<TimelineIcon />} label="Timeline" />
      </div>
    </div>
  );
}

export default Card;
