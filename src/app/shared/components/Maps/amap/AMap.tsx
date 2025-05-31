import { Map, Marker } from '@uiw/react-amap';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { PinLocationIcon } from '@shared/icons';

interface AMapProps {
  latitude: number;
  longitude: number;
  containerStyle?: any;
}

function AMap({
  latitude,
  longitude,
  containerStyle,
}: AMapProps) {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 576px)' });

  return (
    <div
      className="input-apple-map-container"
      style={containerStyle || {
        height: isMobileScreen ? '300px' : '500px',
        width: '100%',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      <Map
        center={new (window as any).AMap.LngLat(+longitude, +latitude)}
      >
        <Marker
          position={new (window as any).AMap.LngLat(+longitude, +latitude)}
        >
          <PinLocationIcon />
        </Marker>
      </Map>
    </div>
  );
}

export default AMap;
