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
import { ArrowUpIcon, RefreshIcon } from '@shared/icons';

import VenueOverlay from './VenueOverlay';
import PostLocationMarker from '../post-location-marker/PostLocationMarker';

interface GoogleMapProps {
  event: any;
  items: any;
  showPost: (item: any) => void;
  refreshMap?: () => void;
  showHideAndShowButton?: boolean;
  toggleStadium?: () => void;
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
      zoom: 17,
    });
  }, [ map, location ]);

  useEffect(() => {
    if (!map) return;
    const styledMapType = new google.maps.StyledMapType(mapStyle);
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
  }, [ map, mapStyle ]);

  return null;
}

function GoogleMap({
  event, items, showPost, refreshMap, showHideAndShowButton, toggleStadium,
}: GoogleMapProps) {
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const i18n = useTranslation('worldEvents');

  return (
    <APIProvider apiKey={appConfig.googleMapsApiKey as string}>
      <div className="map">
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
          id="map"
          mapId="map"
          style={{ height: '100%', width: '100%', borderRadius: '16px' }}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          minZoom={2}
          defaultZoom={event.location ? 17 : 2}
          gestureHandling="greedy"
          disableDefaultUI
          zoomControl
        >

          {items.map((post: any) => (
            <AdvancedMarker
              onClick={() => {}}
              position={{ lat: post.location.latitude, lng: post.location.longitude }}
              key={post.id}
              anchorPoint={[ '50%', '90%' ]}
            >
              <PostLocationMarker
                item={post}
                showPost={() => showPost?.(post)}
              />
            </AdvancedMarker>
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
        <MapStyler id="map" location={event.location} />
      </div>
    </APIProvider>
  );
}

export default GoogleMap;
