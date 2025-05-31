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
import { ArrowUpIcon, RefreshIcon } from '@shared/icons';
import ZoomIn from '@shared/icons/custom-apple-maps/ZoomIn';
import ZoomOut from '@shared/icons/custom-apple-maps/ZoomOut';

import VenueOverlay from './VenueOverlay';
import PostLocationMarker from '../post-location-marker/PostLocationMarker';

interface AppleMapsInterface {
  event: any;
  items: any;
  showPost: (item: any) => void
  refreshMap?: () => void
  showHideAndShowButton?: boolean;
  toggleStadium?: () => void;
}

function AppleMap({
  event, items, showPost, refreshMap, showHideAndShowButton, toggleStadium,
}: AppleMapsInterface) {
  const map = useRef<mapkit.Map>(null);

  useEffect(() => {
    mapkit.init({
      authorizationCallback(done) {
        done(appConfig.appleMapsToken as string);
      },
    });

    setTimeout(() => {
      if (!event.location) {
        return;
      }
      map.current?.setCenterAnimated(
        new mapkit.Coordinate(event.location.latitude, event.location.longitude), true);
    }, 300);

    setTimeout(() => {
      map.current?.setCameraDistanceAnimated(event.location ? 400 : 51709813);
    }, 700);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const i18n = useTranslation('worldEvents');
  return (
    <div className="event-apple-map">
      <VenueOverlay event={event} />
      {toggleStadium && (
        <Button
          color="link"
          size="sm"
          onClick={toggleStadium}
          className={`px-0 hide-and-show-label-color mb-1 hide-and-show-button-stadium-for-fixed-maps ${showHideAndShowButton ? '' : 'd-none'}`}
          aria-label="Toggle stadium map visibility"
        >
          {i18n.button.hideMap}
          <ArrowUpIcon width={15} stroke="var(--bs-white)" />

        </Button>
      )}
      <Map
        ref={map}
        token={appConfig.appleMapsToken as string}
        mapType={MapType.MutedStandard}
        colorScheme={ColorScheme.Dark}
        showsCompass={FeatureVisibility.Hidden}
        showsZoomControl={false}
        showsMapTypeControl={false}
      >
        {items.map((post: any) => (
          <Annotation
            latitude={post.location.latitude}
            longitude={post.location.longitude}
            key={post.id}
            size={isXsScreen ? { width: 54, height: 62 }
              : { width: 90, height: 78 }}
          >
            <PostLocationMarker
              item={post}
              showPost={showPost}
            />
          </Annotation>
        ))}
      </Map>
      {refreshMap && (
        <Button
          size="sm"
          color="primary"
          className="btn-refresh-game-format"
          onClick={refreshMap}
          aria-label="Refresh map"
        >
          {!isXsScreen ? i18n.button.refresh : ''}
          <RefreshIcon width={17} height={17} fill="var(--bs-white)" />
        </Button>
      )}
      <div className={classNames('custom-apple-zoom-control')}>
        <Button onClick={zoomIn}><ZoomIn /></Button>
        <div className="divider" />
        <Button onClick={zoomOut}><ZoomOut /></Button>
      </div>
    </div>
  );
}

export default AppleMap;
