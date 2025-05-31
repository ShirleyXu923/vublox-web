import React from 'react';
import {
  Button, Modal, ModalBody, ModalHeader,
} from 'reactstrap';

import './ClaimModal.scss';
import appConfig from '@config/app';
import LocaleService from '@services/LocaleService';
import useTranslation from '@shared/hooks/useTranslation';

function ClaimModal({ show, toggle }: {
  show: boolean;
  toggle: () => void;
}) {
  const i18n = useTranslation('organizationPage');

  return (
    <Modal isOpen={show} toggle={toggle} className="claim-modal" centered>
      <ModalHeader toggle={toggle}>
        <h1 className="s1">
          {i18n.label.claimTimeline}
        </h1>
      </ModalHeader>
      <ModalBody className="b3">
        {LocaleService.parseTranslation(i18n.label.claimTimelineDesc, {
          email: (
            <Button
              color="link"
              className="b3 text-primary fw-bold"
              onClick={() => window.open(`mailto:${appConfig.contactEmail}`)}
            >
              {appConfig.contactEmail}
            </Button>
          ),
        })}
      </ModalBody>
    </Modal>
  );
}

export default ClaimModal;
