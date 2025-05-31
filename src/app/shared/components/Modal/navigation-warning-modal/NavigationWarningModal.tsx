import React from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';

import './NavigationWarningModal.scss';

interface NavigationWarningModalProps {
  isOpen: boolean;
  toggle: () => void;
  onContinue: () => void;
  title?: string;
  message?: string;
  stayButtonText?: string;
  leaveButtonText?: string;
}

function NavigationWarningModal({
  isOpen,
  toggle,
  onContinue,
  title,
  message,
  stayButtonText,
  leaveButtonText,
}: NavigationWarningModalProps) {
  const i18n = useTranslation('createPost');

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="navigation-warning-modal">
      <ModalHeader toggle={toggle}>
        {title || i18n.label.warningTitle}
      </ModalHeader>
      <ModalBody>
        <div className="d-flex align-items-center">
          <div className="me-3">
            <span className="warning-icon">⚠️</span>
          </div>
          <div>
            {message || i18n.label.processingMetadataWarning}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          {stayButtonText || i18n.button.stay}
        </Button>
        <Button color="danger" onClick={onContinue}>
          {leaveButtonText || i18n.button.leave}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default NavigationWarningModal;
