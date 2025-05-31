import React, { useState } from 'react';
import {
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import LocaleService from '@services/LocaleService';
import { OrganizationIcon } from '@shared/icons';
import Add from '@shared/icons/Add';
import EventIcon from '@shared/icons/EventIcon';
import TimelineIcon from '@shared/icons/TimelineIcon';

interface AddTimeBlockProps {
  setShowModal: (e: boolean) => void;
  toggleModal: () => void;
}

function AddTimeblock({ setShowModal, toggleModal }: AddTimeBlockProps) {
  const i18n = LocaleService.getTranslations('createTimeline');
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Col className="add-timeblock-button" md={11}>
      <Dropdown className="dropdown-custom" isOpen={dropdownOpen} toggle={toggle} direction="down">
        <DropdownToggle
          data-toggle="dropdown"
          tag="span"
          className="dropdown"
        >
          <div className="dropdown-button">
            <Add />
            {i18n.button.addTimeblock}
          </div>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={toggleModal}>
            <EventIcon />
            <span>{i18n.label.event}</span>
          </DropdownItem>
          <DropdownItem onClick={toggleModal}>
            <OrganizationIcon />
            <span>{i18n.label.organization}</span>
          </DropdownItem>
          <DropdownItem onClick={() => setShowModal(true)}>
            <TimelineIcon />
            <span>{i18n.label.timelines}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Col>
  );
}

export default AddTimeblock;
