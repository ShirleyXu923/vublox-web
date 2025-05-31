import { Map, Marker } from '@uiw/react-amap';
import React from 'react';

import EventMarker from './timeline-marker/TimelineMarker';

export interface AMapProps {
  markers: any[];
  onSelect: (item: any) => void;
}

function AMap({
  markers,
  onSelect,
}: AMapProps) {
  return (
    <div className="map">
      <Map
        className="map"
        zoom={1}
      >
        {markers.map((e: any) => (
          <Marker
            key={e.id}
            position={new (window as any).AMap.LngLat(e.location.longitude, e.location.latitude)}
            anchor="bottom-center"
            offset={new (window as any).AMap.Pixel(0, 15)}
          >
            <EventMarker item={e} onSelect={onSelect} />
          </Marker>
        ))}
      </Map>
    </div>
  );
}

export default AMap;
