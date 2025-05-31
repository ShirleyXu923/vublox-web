import React from 'react';
import { Button } from 'reactstrap';

interface IFlatButtonProps {
  onClick?: () => void
  label?: string
}

function FlatButton({ onClick, label }: IFlatButtonProps) {
  return (
    <Button color="link" onClick={onClick}>
      {label}
    </Button>
  );
}

export default FlatButton;
