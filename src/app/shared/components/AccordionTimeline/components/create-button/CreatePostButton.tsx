import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Button,
} from 'reactstrap';

import LocaleService from '@services/LocaleService';
import PlusIcon from '@shared/icons/PlusIcon';

interface CreatePostButtonProps {
  link?: string;
  style?: React.CSSProperties;
  hideContributePost?: boolean;
  eventLink?: string;
  timelineLink?: string;
}

function CreatePostButton({
  link,
  style,
  hideContributePost,
  eventLink,
  timelineLink,
}: CreatePostButtonProps) {
  const [ isDropdownOpen, setDropdownOpen ] = useState(false);
  const i18n = LocaleService.getTranslations('accordionTimeline');
  const isLoggedIn = useSelector(({ Auth }) => !!Auth.accessToken);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleClick = () => {
    if (!isLoggedIn) {
      navigate('/auth');
    }
  };

  return (
    <Dropdown isOpen={isDropdownOpen} toggle={toggleDropdown} style={style}>
      <DropdownToggle
        className="dropdown-button"
        style={{ background: 'none', border: 'none', padding: '0' }}
      >
        <Button
          onClick={handleClick}
          color="primary"
          size="sm"
          className="fw-bold ps-3 pe-4 ms-2 d-flex align-items-center"
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 700,
            lineHeight: '16.94px',
            textAlign: 'left',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          <PlusIcon className="me-1" />
          {i18n.button.contribute}
        </Button>
      </DropdownToggle>
      <DropdownMenu style={{ zIndex: 1010 }}>
        {!hideContributePost && (
          <DropdownItem tag={Link} to={link || '/posts/create#step-1'}>
            {i18n.button.post}
          </DropdownItem>
        )}
        <DropdownItem tag={Link} to={eventLink || '/events/create#step-1'}>
          {i18n.button.event}
        </DropdownItem>
        <DropdownItem tag={Link} to={timelineLink || '/timelines/create'}>
          {i18n.button.timeline}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default CreatePostButton;
