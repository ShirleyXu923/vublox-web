import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from '@vis.gl/react-google-maps';
import React, { useEffect } from 'react';

import appConfig from '@config/app';
import useAppTheme from '@shared/hooks/useAppTheme';

import EventMarker from './timeline-marker/TimelineMarker';

export interface GoogleMapProps {
  markers: any[];
  onSelect: (item: any) => void;
}

function MapStyler({ id }: { id: string }) {
  const map = useMap(id);
  const { mapStyle } = useAppTheme();

  useEffect(() => {
    if (!map) return;
    const styledMapType = new google.maps.StyledMapType(mapStyle);
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
  }, [ map, mapStyle ]);

  return null;
}

function GoogleMap({
  markers,
  onSelect,
}: GoogleMapProps) {
  return (
    <APIProvider apiKey={appConfig.googleMapsApiKey as string}>
      <div className="map">
        <Map
          id="timeline"
          mapId="timeline"
          style={{ height: '100%', width: '100%', borderRadius: '16px' }}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          minZoom={2}
          defaultZoom={2}
          disableDefaultUI
          gestureHandling="greedy"
          zoomControl={false}
          restriction={{
            latLngBounds: {
              south: -85.03040742489164,
              west: -180,
              north: 85.03040742489164,
              east: 180,
            },
            strictBounds: true,
          }}
        >
          {markers.map((e: any) => (
            <AdvancedMarker
              position={{ lat: (e.location || e).latitude, lng: (e.location || e).longitude }}
              key={e.id}
              onClick={() => {}}
              zIndex={e.active ? 1000 : 0}
              anchorPoint={[ '50%', '90%' ]}
            >
              <EventMarker
                item={e}
                onSelect={onSelect}
              />
            </AdvancedMarker>
          ))}
        </Map>
      </div>

      <MapStyler
        id="timeline"
      />
    </APIProvider>
  );
}

export default React.forwardRef(GoogleMap);
