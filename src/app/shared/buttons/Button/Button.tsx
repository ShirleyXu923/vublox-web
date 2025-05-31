import React from 'react';
import { Button as RButton, Spinner, ButtonProps as RButtonProps } from 'reactstrap';

import './Button.scss';

interface ButtonProps extends RButtonProps {
  label?: string;
  color?: string;
  outline?: boolean;
  onClick?: any;
  icon?: React.ReactElement;
  iconPosition?: string;
  disabled?: boolean;
  isForm?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

function Button({
  label,
  color = 'primary',
  outline,
  onClick,
  icon,
  iconPosition = 'left',
  isForm,
  loading,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <RButton className={`r-button ${isForm ? 'is-form' : ''}`} color={color} onClick={onClick} outline={outline} disabled={disabled || loading} {...rest}>
      {loading && (<Spinner className="mx-2" size="sm" />)}
      {iconPosition === 'left' && icon}
      {label && <span className="b6">{label}</span>}
      {rest.children}
      {iconPosition === 'right' && icon}
    </RButton>
  );
}

export default Button;
