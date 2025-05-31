import React from 'react';

import GeneralMap from '@shared/components/Maps/GeneralMap';
import Verified from '@shared/icons/Verified';
import './location.scss';

interface ILocation {
  name?: string;
  address?: string;
  latitude: string;
  longitude: string;
  country_code: string;
}

interface LocationProps {
  location: ILocation;
  verifiedAt?: Date;
}

function Location({ location, verifiedAt }: LocationProps) {
  return (
    <div className="location">
      <div className="map-title">{location?.name}</div>
      <GeneralMap
        countryCode={location?.country_code}
        containerStyle={{
          height: '375px',
          width: '100%',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
        latitude={Number.parseFloat(location?.latitude ?? 0)}
        longitude={Number.parseFloat(location?.longitude ?? 0)}
      />
      {verifiedAt !== null && <Verified />}
    </div>
  );
}

export default Location;
