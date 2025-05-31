/* eslint-disable max-len */
import classNames from 'classnames';
import {
  Annotation,
  ColorScheme,
  FeatureVisibility,
  Map,
  MapType,
} from 'mapkit-react';
import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button } from 'reactstrap';

import appConfig from '@config/app';
import useTranslation from '@shared/hooks/useTranslation';
import { PinLocationIcon, RefreshIcon } from '@shared/icons';
import ZoomIn from '@shared/icons/custom-apple-maps/ZoomIn';
import ZoomOut from '@shared/icons/custom-apple-maps/ZoomOut';

import EventMarker from '../../event-marker/EventMarker';

interface AppleMapProps {
  isFixed?: boolean;
  events: any;
  currentLocation: any;
  location: any;
  onRefresh: () => void;
  handleSetEvent: (e: any) => void;
}

function AppleMap({
  isFixed,
  events,
  currentLocation,
  location,
  onRefresh,
  handleSetEvent,
}: AppleMapProps, mapRef: React.ForwardedRef<any>) {
  const i18n = useTranslation('worldEvents');
  const map = useRef<mapkit.Map>(null);
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });

  useEffect(() => {
  // Check if mapkit and authorization token are defined before proceeding
    if (!mapkit || !appConfig?.appleMapsToken) return;
    mapkit.init({
      authorizationCallback(done) {
        done(appConfig.appleMapsToken as string);
      },
    });

    // Proceed only if location and map reference are available
    if (!location || !map.current) return;

    // Center map on the provided location
    map.current.setCenterAnimated(
      new mapkit.Coordinate(location.latitude, location.longitude),
      true,
    );

    // Set initial camera distance after centering
    map.current.setCameraDistanceAnimated(200, true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ location, events ]);

  const zoomIn = () => {
    if (map.current) {
      const newDistance = map.current.cameraDistance * 0.7; // More aggressive zoom-in
      map.current.setCameraDistanceAnimated(newDistance, true);
    }
  };

  const zoomOut = () => {
    if (map.current) {
      const newDistance = map.current.cameraDistance * 1.5; // More aggressive zoom-out
      map.current.setCameraDistanceAnimated(newDistance, true);
    }
  };

  return (
    <div className={`map ${isFixed ? 'sticky-map' : ''}`} ref={mapRef}>
      <Map
        token={appConfig.appleMapsToken as string}
        mapType={MapType.MutedStandard}
        colorScheme={ColorScheme.Dark}
        showsZoomControl={false}
        isZoomEnabled
        showsMapTypeControl={false}
        showsCompass={FeatureVisibility.Hidden}
        ref={map}
      >
        {events.map((e: any) => (
          <Annotation
            key={e.id}
            latitude={e.location.latitude}
            longitude={e.location.longitude}
            onSelect={() => handleSetEvent(e)}
            size={isXsScreen ? { width: 108, height: 76 } : { width: 108, height: 105 }}
          >
            <EventMarker item={e} />
          </Annotation>
        ))}
        {currentLocation && (
          <Annotation
            latitude={currentLocation.latitude}
            longitude={currentLocation.longitude}
          >
            <PinLocationIcon />
          </Annotation>
        )}
      </Map>

      <Button
        size="sm"
        color="primary"
        className="btn-refresh"
        onClick={onRefresh}
      >
        {!isXsScreen ? i18n.button.refresh : ''}
        <RefreshIcon width={17} height={17} fill="var(--bs-white)" />
      </Button>
      <div className={classNames('custom-apple-zoom-control')}>
        <Button onClick={zoomIn}><ZoomIn /></Button>
        <div className="divider" />
        <Button onClick={zoomOut}><ZoomOut /></Button>
      </div>
    </div>
  );
}

export default React.forwardRef(AppleMap);
