import React from 'react';
import '../modal.scss';
import './ConfirmPublishModal.scss';
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';

interface ConfirmPublishModalProps {
  title?: string;
  description?: string;
  confirmButtonText?: string;
  draftButtonText?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  isOpen?: boolean;
  toggle: () => void;
  style?: any;
}

function ConfirmPublishModal({
  title,
  description,
  confirmButtonText,
  draftButtonText,
  onClose,
  onConfirm,
  isOpen,
  toggle,
  style,
}: ConfirmPublishModalProps) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal" style={style}>
      <ModalHeader toggle={toggle}>
        <h2>{title}</h2>
      </ModalHeader>
      <ModalBody>
        <div className="body">
          <p className="b3">{description}</p>
        </div>
        <div className="modal_button mt-5">
          <Button onClick={onClose} outline color="primary">{draftButtonText}</Button>
          <Button onClick={onConfirm} color="primary">{confirmButtonText}</Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default ConfirmPublishModal;
