import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

import SkipIcon from '@shared/icons/SkipIcon';

import './SkipButton.scss';

interface ISkipButtonProps {
  onClick?: () => void
}

function SkipButton({ onClick }: ISkipButtonProps) {
  const navigate = useNavigate();

  return (
    <Button className="btn-skip" onClick={() => (onClick ? onClick() : navigate('/'))}>
      <span className="mx-1 skip1">Skip</span>
      <SkipIcon />
    </Button>
  );
}

export default SkipButton;
