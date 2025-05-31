/* eslint-disable func-names */
/* eslint-disable max-len */
import { useCallback, useEffect, useState } from 'react';

import appConfig from '@config/app';

const DEFAULT_COUNTRY_CODE = 'CN';
const STORAGE_KEY = 'COUNTRY_CODE';

const useCurrentLocation = (refresh = false) => {
  const [ country, setCountry ] = useState(window.localStorage.getItem(STORAGE_KEY) || DEFAULT_COUNTRY_CODE);

  const setData = (code: string, ip: string) => {
    setCountry(code);
    window.localStorage.setItem(STORAGE_KEY, code);
    window.localStorage.setItem('IP_ADDRESS', ip);
  };

  const getLocation = useCallback(() => {
    const url = `https://ipinfo.io?token=${appConfig.ipInfoToken}`;

    fetch(url)
      .then((res: Response) => res.json())
      .then((data: any) => {
        if (data?.country) {
          setData(data?.country, data?.ip);
          setCountry(data?.country);
        }
      })
      .catch((error: any) => {
        // eslint-disable-next-line no-console
        console.error('Error in fetching country location by IP...', error);
      });
  }, []);

  useEffect(() => {
    const code = window.localStorage.getItem(STORAGE_KEY);
    if (code) {
      setCountry(code);
    }

    if (!code || refresh) {
      getLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    country,
    getLocation,
    setCountry,
  };
};

export default useCurrentLocation;
