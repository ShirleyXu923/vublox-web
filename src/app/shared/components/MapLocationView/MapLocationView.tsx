import {
  AdvancedMarker, APIProvider, Map, useMap,
} from '@vis.gl/react-google-maps';
import React, { useEffect } from 'react';

import appConfig from '@config/app';
import useAppTheme from '@shared/hooks/useAppTheme';
import { PinLocationIcon } from '@shared/icons';

import './MapLocationView.scss';

function MapStyler({ id, location }: { id: string, location: any }) {
  const map = useMap(id);
  const { mapStyle } = useAppTheme();

  useEffect(() => {
    if (!location) return;
    map?.moveCamera({
      center: {
        lat: +location.latitude,
        lng: +location.longitude,
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

function MapLocationView({ location }: { location: any }) {
  return !location ? null : (
    <div className="map-location-view">
      <APIProvider apiKey={appConfig.googleMapsApiKey as string}>
        <div className="map">
          <Map
            id="map"
            mapId="map"
            style={{ height: '100%', width: '100%', borderRadius: '16px' }}
            defaultCenter={{ lat: +location.latitude || 22.54992, lng: +location.longitude || 0 }}
            minZoom={2}
            defaultZoom={17}
            gestureHandling="greedy"
            disableDefaultUI
            zoomControl={false}
          >
            <AdvancedMarker
              position={{ lat: +location.latitude, lng: +location.longitude }}
            >
              <PinLocationIcon />
            </AdvancedMarker>
          </Map>
          <MapStyler id="map" location={location} />
        </div>
      </APIProvider>
    </div>
  );
}

export default MapLocationView;
