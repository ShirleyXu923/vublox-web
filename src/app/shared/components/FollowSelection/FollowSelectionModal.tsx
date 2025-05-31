import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';

import FollowSelection from './FollowSelection';

interface FollowSelectionModalProps {
  show: boolean;
  toggle: () => void;
  onSubmit: () => void;
}

function FollowSelectionModal({ show, toggle, onSubmit }: FollowSelectionModalProps) {
  const i18n = useTranslation('home');
  return (
    <Modal
      isOpen={show}
      toggle={toggle}
      centered
      className="follow-selection-modal"
    >
      <ModalHeader toggle={toggle}>
        <h1 className="s1">
          {i18n.label.followUsers}
        </h1>
      </ModalHeader>
      <ModalBody>
        <FollowSelection
          inModal
          onSubmit={() => {
            onSubmit();
            toggle();
          }}
        />
      </ModalBody>
    </Modal>
  );
}

export default FollowSelectionModal;
