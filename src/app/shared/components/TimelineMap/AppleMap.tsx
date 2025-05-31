import {
  Annotation,
  ColorScheme,
  FeatureVisibility,
  Map,
  MapType,
} from 'mapkit-react';
import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

import appConfig from '@config/app';

import EventMarker from './timeline-marker/TimelineMarker';

export interface AppleMapProps {
  markers: any[];
  onSelect: (item: any) => void;
}

function AppleMap({
  markers,
  onSelect,
}: AppleMapProps) {
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });

  useEffect(() => {
  // Check if mapkit and authorization token are defined before proceeding
    if (!mapkit || !appConfig?.appleMapsToken) return;
    mapkit.init({
      authorizationCallback(done) {
        done(appConfig.appleMapsToken as string);
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="map">
      <Map
        token={appConfig.appleMapsToken as string}
        mapType={MapType.MutedStandard}
        colorScheme={ColorScheme.Dark}
        showsZoomControl={false}
        isZoomEnabled
        showsMapTypeControl={false}
        showsCompass={FeatureVisibility.Hidden}
        initialRegion={{
          centerLatitude: 115,
          centerLongitude: 24,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
      >
        {markers.map((e: any) => (
          <Annotation
            key={e.id}
            latitude={e.location.latitude}
            longitude={e.location.longitude}
            size={isXsScreen ? { width: 108, height: 70 } : { width: 108, height: 105 }}
          >
            <EventMarker item={e} onSelect={onSelect} />
          </Annotation>
        ))}
      </Map>
    </div>
  );
}

export default React.forwardRef(AppleMap);
