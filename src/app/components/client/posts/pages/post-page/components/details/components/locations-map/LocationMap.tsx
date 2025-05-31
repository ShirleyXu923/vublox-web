import React from 'react';
import { useMediaQuery } from 'react-responsive';

import GeneralMap from '@shared/components/Maps/GeneralMap';
import useTranslation from '@shared/hooks/useTranslation';
import { LocationType } from 'types';

interface LocationMapProps {
  location: LocationType;
}

function LocationMap({ location }: LocationMapProps) {
  const i18n = useTranslation('postPage');
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });

  return (
    <div className="location-map">
      <div className="b5">{i18n.label.location}</div>
      <GeneralMap
        countryCode={location.country_code}
        containerStyle={{
          height: '375px',
          width: '100%',
          borderRadius: isSmScreen ? '4px' : '20px',
          overflow: 'hidden',
          marginTop: '16px',
        }}
        latitude={location.latitude as number}
        longitude={location.longitude as number}
      />
    </div>
  );
}

export default LocationMap;
