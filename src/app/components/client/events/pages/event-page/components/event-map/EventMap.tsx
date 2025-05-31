import { APILoader } from '@uiw/react-amap';
import React, { useEffect } from 'react';

import appConfig from '@config/app';
import useCurrentLocation from '@shared/hooks/useCurrentLocation';

import AMap from './AMap';
import GoogleMap from './GoogleMap';

function EventMap({ ...rest }: any) {
  const { country, setCountry } = useCurrentLocation();

  useEffect(() => {
    if (rest?.countryCode) {
      setCountry(rest?.countryCode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ rest ]);

  return country !== 'CN' && rest.countryCode !== 'CN'
    ? (
      <GoogleMap {...rest} />
    )
    : (
      <APILoader
        akey={appConfig.amap.apiKey}
        version="2.0.5"
      >
        <AMap {...rest} />
      </APILoader>
    );
}

export default EventMap;
