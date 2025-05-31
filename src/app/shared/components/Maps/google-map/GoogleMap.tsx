import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapMouseEvent,
  // Marker,
  useMap,
} from '@vis.gl/react-google-maps';
import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

import appConfig from '@config/app';
import useAppTheme from '@shared/hooks/useAppTheme';
import { PinLocationIcon } from '@shared/icons';

function MapStyler({ id, location }: { id: string, location: any }) {
  const map = useMap(id);
  const { mapStyle } = useAppTheme();

  useEffect(() => {
    if (!location?.latitude && !location?.longitude) return;
    const { latitude = 0, longitude = 0 } = location;
    map?.moveCamera({
      center: {
        lat: +latitude,
        lng: +longitude,
      },
      zoom: 17,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ location ]);

  useEffect(() => {
    if (!map) return;
    const styledMapType = new google.maps.StyledMapType(mapStyle);
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
  }, [ map, mapStyle ]);

  return null;
}

interface GoogleMapProps {
  latitude: number,
  longitude: number,
  onClick: (event: MapMouseEvent) => void;
  mapStyle?: any;
  minZoom?: number;
  defaultZoom?: number;
  gestureHandling?: string;
  zoomControl?: boolean;
  disableDefaultUI?: boolean;
  editable?: boolean;
}

function GoogleMap({
  latitude,
  longitude,
  onClick,
  mapStyle,
  minZoom = 2,
  defaultZoom = 17,
  gestureHandling = 'greedy',
  zoomControl,
  disableDefaultUI = true,
  editable,
}: GoogleMapProps,
ref: React.ForwardedRef<any>) {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 576px)' });

  return (
    <APIProvider apiKey={appConfig.googleMapsApiKey as string}>
      <div className="map google-map map-location-view" style={{ height: isMobileScreen ? '300px' : '500px', borderRadius: '20px' }}>
        <Map
          id="map"
          mapId="map"
          style={mapStyle || { height: '100%', width: '100%', borderRadius: '16px' }}
          defaultCenter={{ lat: latitude, lng: longitude }}
          minZoom={minZoom}
          defaultZoom={defaultZoom}
          gestureHandling={gestureHandling}
          zoomControl={zoomControl}
          disableDefaultUI={disableDefaultUI}
          onClick={editable ? onClick : () => {}}
          clickableIcons={false}
        >
          {(latitude && longitude) && (
            <AdvancedMarker
              ref={ref}
              position={{ lat: latitude, lng: longitude }}
            >
              <PinLocationIcon />
            </AdvancedMarker>
          )}
        </Map>
        <MapStyler id="map" location={{ latitude, longitude }} />
      </div>
    </APIProvider>
  );
}

export default React.forwardRef(GoogleMap);
