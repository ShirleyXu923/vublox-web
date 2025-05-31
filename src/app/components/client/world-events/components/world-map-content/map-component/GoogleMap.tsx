import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from '@vis.gl/react-google-maps';
import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button } from 'reactstrap';

import appConfig from '@config/app';
import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';
import { PinLocationIcon, RefreshIcon } from '@shared/icons';

import EventMarker from '../../event-marker/EventMarker';

interface GoogleMapProps {
  mapId: string;
  isFixed?: boolean;
  setBounds: (e: any) => void;
  events: any;
  currentLocation: any;
  handleSetEvent: (e: any) => void;
  onRefresh: () => void;
  location: any;
}

function MapStyler({ id, location }: { id: string, location: any }) {
  const map = useMap(id);
  const { mapStyle } = useAppTheme();
  useEffect(() => {
    if (!location) return;
    map?.moveCamera({
      center: {
        lat: location.latitude,
        lng: location.longitude,
      },
      zoom: 5,
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

function GoogleMap({
  isFixed,
  mapId,
  setBounds,
  events,
  currentLocation,
  handleSetEvent,
  onRefresh,
  location,
}: GoogleMapProps, mapRef: React.ForwardedRef<any>) {
  const i18n = useTranslation('worldEvents');
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });

  return (
    <APIProvider apiKey={appConfig.googleMapsApiKey as string}>
      <div className={`map ${isFixed ? 'sticky-map' : ''}`} ref={mapRef}>
        <Map
          id={mapId}
          mapId={mapId}
          style={{ height: '100%', width: '100%', borderRadius: '16px' }}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          minZoom={2}
          defaultZoom={2}
          gestureHandling="greedy"
          disableDefaultUI
          onBoundsChanged={e => setBounds(e.map.getBounds())}
          zoomControl
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
          {events.map((e: any) => (
            <AdvancedMarker
              position={{ lat: e.location.latitude, lng: e.location.longitude }}
              key={e.id}
              onClick={() => handleSetEvent(e)}
              zIndex={e.active ? 1000 : 0}
            >
              <EventMarker
                item={e}
              />
            </AdvancedMarker>
          ))}
          {currentLocation && (
            <AdvancedMarker
              position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
              anchorPoint={[ '50%', '90%' ]}
            >
              <PinLocationIcon />
            </AdvancedMarker>
          )}
        </Map>

        <Button
          size="sm"
          color="primary"
          className={`btn-refresh ${!isXsScreen ? 'px-4' : ''}`}
          onClick={onRefresh}
        >
          {!isXsScreen ? i18n.button.refresh : ''}
          <RefreshIcon width={17} height={17} fill="var(--bs-white)" />
        </Button>
      </div>

      <MapStyler
        id={mapId}
        location={location}
      />
    </APIProvider>
  );
}

export default React.forwardRef(GoogleMap);
