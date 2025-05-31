import React, { useState } from 'react';
import { Button } from 'reactstrap';

import { VisibilityOffIcon, VisibilityOnIcon } from '@shared/icons';

import Input, { InputProps } from '../Input/Input';

function PasswordInput(props: InputProps) {
  const [ showPassword, setShowPassword ] = useState(false);
  return (
    <Input
      {...props}
      type={showPassword ? 'text' : 'password'}
      rightIcon={(
        <Button
          color="link"
          size="sm"
          onClick={() => setShowPassword((s) => !s)}
        >
          {showPassword ? (
            <VisibilityOnIcon />
          ) : (
            <VisibilityOffIcon />
          )}
        </Button>
      )}
    />
  );
}

export default PasswordInput;
