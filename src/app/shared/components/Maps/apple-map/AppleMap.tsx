import {
  Annotation,
  ColorScheme,
  FeatureVisibility,
  Map,
  MapInteractionEvent,
  MapType,
} from 'mapkit-react';
import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

import appConfig from '@config/app';
import { PinLocationIcon } from '@shared/icons';

interface AppleMapProps {
  latitude: number;
  longitude: number;
  containerStyle?: any;
  onAppleMapsClick: (event: MapInteractionEvent) => void;
  editable?: boolean;
  isScrollEnabled?: boolean;
  isZoomEnabled?: boolean;
}

function AppleMap({
  latitude,
  longitude,
  containerStyle,
  onAppleMapsClick,
  editable,
  isScrollEnabled,
  isZoomEnabled,
}: AppleMapProps) {
  const map = useRef<mapkit.Map>(null);
  const isMobileScreen = useMediaQuery({ query: '(max-width: 576px)' });

  useEffect(() => {
    mapkit.init({
      authorizationCallback(done) {
        done(appConfig.appleMapsToken as string);
      },
    });

    setTimeout(() => {
      map.current?.setCenterAnimated(
        new mapkit.Coordinate(+latitude, +longitude), true);
    }, 300);

    setTimeout(() => {
      map.current?.setCameraDistanceAnimated(400);
    }, 700);
  }, [ latitude, longitude ]);

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
        ref={map}
        token={appConfig.appleMapsToken as string}
        mapType={MapType.MutedStandard}
        colorScheme={ColorScheme.Dark}
        onSingleTap={editable ? onAppleMapsClick : () => {}}
        showsCompass={FeatureVisibility.Hidden}
        showsZoomControl={false}
        showsMapTypeControl={false}
        isScrollEnabled={isScrollEnabled}
        isZoomEnabled={isZoomEnabled}
      >
        <Annotation
          latitude={+latitude}
          longitude={+longitude}
        >
          <PinLocationIcon />
        </Annotation>
      </Map>
    </div>
  );
}

export default AppleMap;
