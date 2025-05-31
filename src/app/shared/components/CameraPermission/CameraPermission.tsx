import React, { useEffect, useState } from 'react';
import { Alert } from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { ErrorIcon } from '@shared/icons';

function CameraPermission() {
  const i18n = useTranslation('general.upload');
  const [ hasCameraPermission, setHasCameraPermission ] = useState(true);

  useEffect(() => {
    navigator.permissions.query({ name: 'camera' as any }).then((status) => {
      setHasCameraPermission(status.state !== 'denied');
      // eslint-disable-next-line no-param-reassign
      status.onchange = () => {
        const { state } = status;
        setHasCameraPermission(state !== 'denied');
      };
    });
  }, []);

  return hasCameraPermission ? null : (
    <Alert
      color="danger"
      className="border-0 d-flex align-items-center lh-sm"
    >
      <ErrorIcon width="24" height="24" className="me-2" />
      <div>
        {!hasCameraPermission && i18n.cameraPermission}
      </div>
    </Alert>
  );
}

export default CameraPermission;
