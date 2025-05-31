import './DeclineModal.scss';

import React from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

import { Button } from '@shared/buttons/Button';
import useTranslation from '@shared/hooks/useTranslation';

interface ModalProps {
  modal?: boolean;
  toggle: () => void;
  confirm: () => void;
}

function DeclineModal({
  modal,
  toggle,
  confirm,
}: ModalProps) {
  const i18n = useTranslation('createPost');

  return (
    <Modal
      className="delete-modal-custom"
      isOpen={modal}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        <div className="s2">{i18n.label.dontShowToolTipTitle}</div>
      </ModalHeader>
      <ModalBody>
        {i18n.label.dontShowToolTipContent}
      </ModalBody>
      <ModalFooter>
        <Button
          outline
          color="danger"
          label={i18n.button.cancel}
          isForm
          onClick={toggle}
        />
        <Button
          color="primary"
          label={i18n.button.confirm}
          isForm
          outline
          onClick={confirm}
        />
      </ModalFooter>
    </Modal>
  );
}

export default DeclineModal;
