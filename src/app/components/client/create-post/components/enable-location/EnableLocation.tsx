import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  Alert, Button, Modal, ModalBody, ModalHeader,
} from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { InfoIcon } from '@shared/icons';

function EnableLocation({ getCurrentLocation, show, toggle }: {
  getCurrentLocation: () => void;
  show?: boolean;
  toggle?: () => void;
}) {
  const i18n = useTranslation('createPost');
  const [ hasLocationPermission, setHasLocationPermission ] = useState(false);
  const isSmallScreen = useMediaQuery({ query: '(max-width: 575px)' });

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' })
      .then(res => {
        setHasLocationPermission(res.state === 'granted');
        res.onchange = () => setHasLocationPermission(res.state === 'granted');
      });
  }, []);

  useEffect(() => {
    if (show && hasLocationPermission) {
      toggle?.();
    }
  }, [ hasLocationPermission, show, toggle ]);

  return !hasLocationPermission && (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isSmallScreen ? (
        <Modal isOpen={show} toggle={toggle} centered size="xs mx-4">
          <ModalHeader toggle={toggle}>
            <h3 className="s3 pt-2">{i18n.label.enableGpsLocation}</h3>
          </ModalHeader>
          <ModalBody>
            <div className="mb-4 b3">{i18n.label.enableLocation}</div>
            <Button block size="sm" className="p-2 my-3" color="primary" onClick={getCurrentLocation}>
              {i18n.label.enableGpsLocation}
            </Button>
          </ModalBody>
        </Modal>
      ) : (
        <Alert color="highlight d-flex mb-4">
          <div>
            <InfoIcon fill="var(--bs-primary)" height={24} width={24} />
          </div>
          <div className="text-content ms-2 pt-1 pe-1">
            <div className="mb-2 lh-sm">{i18n.label.enableLocation}</div>
            <Button size="sm" color="primary" onClick={getCurrentLocation}>
              {i18n.button.enableLocation}
            </Button>
          </div>
        </Alert>
      )}
    </>
  );
}

export default EnableLocation;
