import { useEffect, useRef } from 'react';

import appConfig from '@config/app';

import 'apple-mapkit-js';

const useMapKit = () => {
  const map = useRef<mapkit.Map>(null);

  useEffect(() => {
    mapkit.init({
      authorizationCallback(done) {
        done(appConfig.appleMapsToken as string);
      },
    });
  }, []);

  return { map };
};

export default useMapKit;
