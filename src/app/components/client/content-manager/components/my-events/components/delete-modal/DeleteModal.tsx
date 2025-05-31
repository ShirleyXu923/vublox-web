import './DeleteModal.scss';

import React from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

import { Button } from '@shared/buttons/Button';
import { dateToCalendar, dateToTime } from '@shared/helpers';
import useThumbnail from '@shared/hooks/useThumbnail';
import useTranslation from '@shared/hooks/useTranslation';

interface ModalProps {
  modal?: boolean;
  toggle: () => void;
  data?: any;
  confirm: () => void;
}

function DeleteModal({
  modal,
  toggle,
  data,
  confirm,
}: ModalProps) {
  const i18n = useTranslation('contentManager');
  const { thumbnail } = useThumbnail(data);

  return (
    <Modal
      className="delete-modal-custom"
      isOpen={modal}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        <div className="s1">{i18n.events.deleteEvent}</div>
      </ModalHeader>
      <ModalBody>
        <div className="event">
          <div className="banner">
            <div className="image__cover">
              {thumbnail}
            </div>
          </div>
          <div className="info">
            <div className="b2">{data?.name}</div>
            <div className="b5 text-truncate description" style={{ maxWidth: '560px' }}>{data?.description}</div>
            <div className="caption1 text-truncate">
              <span>{dateToCalendar(data?.started_at)}, {dateToTime(data?.started_at)}</span>
              <div className="seperator" />
              <span>{data?.location?.name}</span>
            </div>
          </div>
        </div>
        <div className="b3 mt-4">{i18n.events.deleteDescription}</div>
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
          color="danger"
          label={i18n.events.delete}
          isForm
          onClick={confirm}
        />
      </ModalFooter>
    </Modal>
  );
}

export default DeleteModal;
