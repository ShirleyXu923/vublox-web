import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

import LocaleService from '@services/LocaleService';
import { BackIcon } from '@shared/icons';

import './BackButton.scss';

interface IBackButtonProps {
  onClick?: () => void
}

function BackButton({ onClick }: IBackButtonProps) {
  const i18n = LocaleService.getTranslations('general');
  const navigate = useNavigate();

  return (
    <Button color="dark" className="btn-back" onClick={() => (onClick ? onClick() : navigate(-1))}>
      <BackIcon /> {i18n.button.back}
    </Button>
  );
}

export default BackButton;
