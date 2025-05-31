// NOTE: Dependency cycle are needed for the children components to work in the timeline component.
/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useState } from 'react';

import './EventCard.scss';
import { ImageType, LocationType } from 'types';

import Card from './Card';
import { Pin } from '../../components/pin';

interface EventCardProps {
  id?: string;
  name?: string;
  description?: string;
  started_at: Date;
  ended_at: Date;
  location: LocationType;
  banner_url: ImageType;
  posts: any[];
  coCreators: any[];
  owner: any;
  children: any[];
  hasExtender: boolean;
}

function EventCard({ hasExtender, ...rest }: EventCardProps, open: any) {
  const cardRef = useRef<any>(null);
  const [ height, setHeight ] = useState<number>(1200);

  useEffect(() => {
    setHeight(cardRef.current?.clientHeight);
  }, [ open ]);

  return (
    <div className="event-card-container">
      <Pin withExtender={hasExtender} height={height} />

      <div ref={cardRef} className="card-wrap">
        <Card {...rest} />
      </div>
    </div>
  );
}

export default EventCard;
