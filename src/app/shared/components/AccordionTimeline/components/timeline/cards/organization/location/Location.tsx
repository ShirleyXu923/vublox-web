import React from 'react';

import { LocationType } from 'types';

import Card from './Card';
import { Pin } from '../../../components/pin';

interface LocationProps {
  location: LocationType;
  started_at: Date;
  ended_at: Date;
}

function Location({ ...rest }: LocationProps) {
  return (
    <div className="organization-bio-container">
      <Pin height={500} />

      <Card {...rest} />
    </div>
  );
}

export default Location;
