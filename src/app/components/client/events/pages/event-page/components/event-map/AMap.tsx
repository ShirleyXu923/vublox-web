import { Map, Marker } from '@uiw/react-amap';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button } from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { ArrowUpIcon, RefreshIcon } from '@shared/icons';
import ZoomIn from '@shared/icons/custom-apple-maps/ZoomIn';
import ZoomOut from '@shared/icons/custom-apple-maps/ZoomOut';

import VenueOverlay from './VenueOverlay';
import PostLocationMarker from '../post-location-marker/PostLocationMarker';

interface AMapsInterface {
  event: any;
  items: any;
  showPost: (item: any) => void
  refreshMap?: () => void
  showHideAndShowButton?: boolean;
  toggleStadium?: () => void;
}

function AMap({
  event, items, showPost, refreshMap, showHideAndShowButton, toggleStadium,
}: AMapsInterface) {
  const [ zoom, setZoom ] = React.useState(20);
  const [ center, setCenter ] = React.useState([ event.location?.longitude,
    event.location?.latitude ]);
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const i18n = useTranslation('worldEvents');

  const zoomIn = () => {
    if (zoom >= 1 && zoom < 20) {
      setZoom(zoom + 1);
    }
  };

  const zoomOut = () => {
    if (zoom > 1) {
      setZoom(zoom - 1);
    }
  };

  useEffect(() => {
    setCenter([ event.location?.longitude, event.location?.latitude ]);
    setZoom(20);
  }, [ event?.location?.latitude, event?.location?.longitude ]);

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
        zoom={zoom}
        center={center}
      >
        {items.map((post: any) => (
          <Marker
            key={post.id}
            position={new (window as any).AMap.LngLat(post.location.longitude,
              post.location.latitude)}
            anchor="bottom-center"
            offset={new (window as any).AMap.Pixel(0, 15)}
          >
            <PostLocationMarker
              item={post}
              showPost={showPost}
            />
          </Marker>
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

export default AMap;
