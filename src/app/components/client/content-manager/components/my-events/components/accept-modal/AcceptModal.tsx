import './AcceptModal.scss';

import React from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

import LocaleService from '@services/LocaleService';
import { Button } from '@shared/buttons/Button';
import useTranslation from '@shared/hooks/useTranslation';

interface ModalProps {
  modal?: boolean;
  toggle: () => void;
  eventTitle?: string;
  eventAuthor?: string;
  confirm: () => void;
}

function AcceptModal({
  modal,
  toggle,
  eventTitle,
  eventAuthor = 'Event Author',
  confirm,
}: ModalProps) {
  const i18n = useTranslation('contentManager');

  return (
    <Modal
      className="delete-modal-custom"
      isOpen={modal}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        <div className="s2">{i18n.events.acceptUserInvitation}</div>
      </ModalHeader>
      <ModalBody>
        {LocaleService.parseTranslation(i18n.events.acceptInvitationMessage, {
          event: (
            <b>{eventTitle}</b>
          ),
          author: (
            <b>{eventAuthor}</b>
          ),
        })}
      </ModalBody>
      <ModalFooter>
        <Button
          outline
          color="danger"
          label={i18n.events.cancel}
          isForm
          onClick={toggle}
        />
        <Button
          color="primary"
          label={i18n.events.accept}
          isForm
          outline
          onClick={confirm}
        />
      </ModalFooter>
    </Modal>
  );
}
export default AcceptModal;
