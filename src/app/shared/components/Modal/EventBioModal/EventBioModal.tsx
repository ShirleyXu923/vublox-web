import './EventBioModal.scss';
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Modal, ModalBody, ModalHeader,
} from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { TagIcon } from '@shared/icons';

interface EventBioModalProps {
  event: any;
  title: string;
  isOpen?: boolean;
  toggle: () => void;
}

function EventBioModal({
  event, title, isOpen, toggle,
}: EventBioModalProps) {
  const i18n = useTranslation('eventPage');
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="event_bio__modal">
      <ModalHeader toggle={toggle}>
        <h2>{title}</h2>
      </ModalHeader>
      <ModalBody>
        <div className="body">
          <p className="b3 text-body">{event?.description}</p>
        </div>
        <div className="caption3 text-uppercase">{i18n.label.coCreators}</div>
        <div className="tags">
          {event?.coCreators?.length === 0 && (
            <div className="caption1">-</div>
          )}
          {event?.coCreators?.map?.((coCreator: any) => (
            <div className="tag" key={coCreator?.creator?.id}>
              <NavLink to={coCreator?.creator?.link} className="text-body">
                <span className="caption1">{coCreator?.creator?.name}</span>
              </NavLink>
            </div>
          ))}
        </div>
        <div className="caption3 text-uppercase">{i18n.label.tags}</div>
        <div className="tags">
          {(!event?.tags || event.tags.length === 0) && (
            <div className="caption1">-</div>
          )}
          {event?.tags?.map((tag: any) => (
            <div className="tag" key={tag}>
              <TagIcon />
              <span className="caption1">{tag}</span>
            </div>
          ))}
        </div>
      </ModalBody>
    </Modal>
  );
}

export default EventBioModal;
