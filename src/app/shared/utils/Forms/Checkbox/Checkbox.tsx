import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

interface CheckboxProps {
  label?: string
  onChange?: () => void
  checked?: boolean
  disabled?: boolean;
}

function Checkbox({
  label,
  onChange,
  checked,
  disabled,
}: CheckboxProps) {
  return (
    <FormGroup
      check
      inline
    >
      <Input type="checkbox" onChange={onChange} checked={checked} disabled={disabled} />
      <Label check className="b5">
        {label}
      </Label>
    </FormGroup>
  );
}

export default Checkbox;
