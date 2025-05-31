import { useCallback, useState } from 'react';

import { handleError } from '@services/ErrorHandler';

interface LocationType {
  latitude: number,
  longitude: number,
}

function useGeoCoding() {
  const [ countryCode, setCountryCode ] = useState<string | null>('CN');
  const getCountryFromCoordinate = useCallback((coordinate: LocationType) => {
    const geocoder = new mapkit.Geocoder();
    const c = new mapkit.Coordinate(coordinate.latitude, coordinate.longitude);
    geocoder.reverseLookup(c, (err, data: mapkit.GeocoderResponse) => {
      if (!err) {
        const { results } = data;
        const result = results[0];
        setCountryCode(result.countryCode);
      } else {
        handleError(err);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    getCountryFromCoordinate,
    countryCode,
  };
}

export default useGeoCoding;
