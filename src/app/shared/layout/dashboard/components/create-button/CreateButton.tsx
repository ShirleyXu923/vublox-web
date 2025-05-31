import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import PlusIcon from '@shared/icons/PlusIcon';

import './CreateButton.scss';

function CreateButton() {
  const i18n = useTranslation('navbar');
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });
  const navigate = useNavigate();
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return isSmScreen ? (
    <Dropdown className="dropdown-create" isOpen={dropdownOpen} toggle={toggle} direction="down">
      <DropdownToggle
        data-toggle="dropdown"
        tag="span"
        className="dropdown"
      >
        <Button
          size="sm"
          color="link"
          className="btn-post"
        >
          <PlusIcon fill="var(--bs-primary)" />
        </Button>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          onClick={() => navigate('/posts/create#step-1')}
        >
          <span>{i18n.button.post}</span>
        </DropdownItem>
        <DropdownItem
          onClick={() => navigate('/events/create#step-1')}
        >
          <span>{i18n.button.event}</span>
        </DropdownItem>
        <DropdownItem
          onClick={() => navigate('/organizations/create')}
        >
          <span>{i18n.button.organization}</span>
        </DropdownItem>
        <DropdownItem
          onClick={() => navigate('/timelines/create')}
        >
          <span>Timeline</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : (
    <Dropdown className="dropdown-create" isOpen={dropdownOpen} toggle={toggle} direction="down">
      <DropdownToggle
        data-toggle="dropdown"
        tag="span"
        className="dropdown"
      >
        <Button
          size="sm"
          color="primary"
          className="fw-bold ps-3 pe-4 ms-2 d-flex align-items-center"
        >
          <PlusIcon className="me-1" />
          {i18n.button.create}
        </Button>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          onClick={() => navigate('/posts/create#step-1')}
        >
          <span>{i18n.button.post}</span>
        </DropdownItem>
        <DropdownItem
          onClick={() => navigate('/events/create#step-1')}
        >
          <span>{i18n.button.event}</span>
        </DropdownItem>
        <DropdownItem
          onClick={() => navigate('/organizations/create')}
        >
          <span>{i18n.button.organization}</span>
        </DropdownItem>
        <DropdownItem
          onClick={() => navigate('/timelines/create')}
        >
          <span>Timeline</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default CreateButton;
