import {
  Map, Marker,
} from '@uiw/react-amap';
import classNames from 'classnames';
import React, {
  memo,
} from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button } from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { PinLocationIcon, RefreshIcon } from '@shared/icons';
import ZoomIn from '@shared/icons/custom-apple-maps/ZoomIn';
import ZoomOut from '@shared/icons/custom-apple-maps/ZoomOut';

import EventMarker from '../../event-marker/EventMarker';

interface AMapProps {
  isFixed?: boolean;
  events: any;
  currentLocation: any;
  onRefresh: () => void;
  handleSetEvent: (e: any) => void;
}

function AMap({
  isFixed,
  events,
  currentLocation,
  onRefresh,
  handleSetEvent,
}: AMapProps) {
  const i18n = useTranslation('worldEvents');
  const [ zoom, setZoom ] = React.useState(1);
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });

  const zoomIn = () => {
    if (zoom >= 1 && zoom < 17) {
      setZoom(zoom + 1);
    }
  };

  const zoomOut = () => {
    if (zoom > 1) {
      setZoom(zoom - 1);
    }
  };

  return (
    <div className={`map ${isFixed ? 'sticky-map' : ''}`}>
      <Map
        className="map"
        zoom={zoom}
      >
        {events.map((e: any) => (
          <Marker
            key={e.id}
            visible
            anchor="bottom-center"
            offset={new (window as any).AMap.Pixel(0, 15)}
            position={new (window as any).AMap.LngLat(e.location.longitude, e.location.latitude)}
            onClick={() => handleSetEvent(e)}
          >
            <EventMarker item={e} />
          </Marker>
        ))}
        {currentLocation && (
          <Marker
            visible
            anchor="bottom-center"
            offset={new (window as any).AMap.Pixel(0, 0)}
            position={new (window as any).AMap.LngLat(currentLocation.longitude,
              currentLocation.latitude)}
          >
            <PinLocationIcon />
          </Marker>
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

export default memo(AMap);
