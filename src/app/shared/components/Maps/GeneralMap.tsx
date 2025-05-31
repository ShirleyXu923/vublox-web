import { APILoader } from '@uiw/react-amap';
import React, { useEffect } from 'react';

import appConfig from '@config/app';
import useCurrentLocation from '@shared/hooks/useCurrentLocation';

import AMap from './amap/AMap';
import { GoogleMap } from './google-map';

import './GeneralMap.scss';

function GeneralMap({ ...rest }: any) {
  const { country, setCountry } = useCurrentLocation();

  useEffect(() => {
    if (rest?.countryCode) {
      setCountry(rest?.countryCode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ rest.countryCode ]);

  return country !== 'CN' && rest.countryCode !== 'CN'
    ? (
      <GoogleMap
        {...rest}
        latitude={+rest.latitude || 0}
        longitude={+rest.longitude || 0}
      />
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

export default GeneralMap;
