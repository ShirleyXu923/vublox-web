import './DeleteModal.scss';

import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';

interface DeleteModalProps {
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  toggle: () => void;
  isOpen?: boolean;
}

function DeleteModal({
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  toggle,
  isOpen,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-delete-modal">
      <ModalHeader toggle={toggle}>
        <h2>{title}</h2>
      </ModalHeader>
      <ModalBody>
        <div className="body">
          <p className="b3">{description}</p>
        </div>
        <div className="action-button">
          <Button onClick={toggle} outline color="danger">{cancelButtonText}</Button>
          <Button onClick={onConfirm} color="danger" className="confirm_btn">{confirmButtonText}</Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default DeleteModal;
