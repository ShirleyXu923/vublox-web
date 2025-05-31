import { APILoader } from '@uiw/react-amap';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Alert, Button } from 'reactstrap';

import appConfig from '@config/app';
import TimelineSlider from '@shared/components/TimelineMap/timeline-slider/TimelineSlider';
import useCurrentLocation from '@shared/hooks/useCurrentLocation';
import useTranslation from '@shared/hooks/useTranslation';
import { InfoIcon } from '@shared/icons';

import AMap from './AMap';
import GoogleMap from './GoogleMap';
import styles from './MapComponent.module.scss';

function MapComponent({
  startDate, endDate, onSelectTimeRange, ...rest
}: any, mapRef: React.ForwardedRef<any>) {
  const { country } = useCurrentLocation();
  const i18n = useTranslation('worldEvents');
  const [ hasLocationPermission, setHasLocationPermission ] = useState(false);
  const [ currentLocation, setCurrentLocation ] = useState<any>(null);
  const isMobileScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentLocation(pos.coords);
      setHasLocationPermission(true);
    });
  };

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' })
      .then(res => {
        setHasLocationPermission(res.state === 'granted');
        res.onchange = () => setHasLocationPermission(res.state === 'granted');
      });
  }, []);

  return (
    <>
      {!hasLocationPermission && isMobileScreen && (
        <Alert
          color="highlight"
          role="alert"
          aria-label={i18n.label.enableLocation}
          className={`d-flex flex-column align-items-start mx-3 ${styles['world-event-alert-highlight-mobile']}`}

        >
          {/* First row: Info Icon and Label in the same line */}
          <div className="d-flex align-items-center gap-2 mb-1">
            <InfoIcon fill="var(--bs-primary)" height={30} width={30} />
            <div className="b5 text-dark lh-sm">{i18n.label.enableLocation}</div>
          </div>

          {/* Second row: Label and Button in the same column */}
          <div className="ms-4 d-flex flex-column align-items-start gap-2">
            <Button size="sm" color="primary" onClick={getCurrentLocation}>
              {i18n.button.enableLocation}
            </Button>
          </div>
        </Alert>
      )}
      <div className={styles.map}>
        {!hasLocationPermission && !isMobileScreen && (
          <Alert
            color="highlight"
            role="alert"
            aria-label={i18n.label.enableLocation}
            className="d-flex align-items-center"
          >
            <div>
              <InfoIcon fill="var(--bs-primary)" height={30} width={30} />
            </div>
            <div className="ms-2 d-flex align-items-center gap-3">
              <div className="b5 text-dark lh-sm">{i18n.label.enableLocation}</div>
              <Button
                size="sm"
                color="primary"
                className="px-4"
                onClick={getCurrentLocation}
              >
                {i18n.button.enableLocation}
              </Button>
            </div>
          </Alert>
        )}

        {country !== 'CN'
          ? (
            <GoogleMap {...rest} mapRef={mapRef} currentLocation={currentLocation} />
          )
          : (
            <APILoader
              akey={appConfig.amap.apiKey}
              version="2.0.5"
            >
              <AMap {...rest} mapRef={mapRef} currentLocation={currentLocation} />
            </APILoader>
          )}

        {rest.mapId !== 'trending' && (
          <div className="slider">
            <TimelineSlider
              startedAt={startDate}
              endedAt={endDate}
              onSelectTimeRange={onSelectTimeRange}
            />
          </div>
        )}
      </div>
    </>

  );
}

export default MapComponent;
