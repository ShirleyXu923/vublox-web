import classNames from 'classnames';
import React, { forwardRef } from 'react';
import {
  FormGroup, Input as RInput, Label, InputProps as RInputProps, FormFeedback,
  InputGroup,
  InputGroupText,
  FormGroupProps,
  InputGroupTextProps,
  FormText,
} from 'reactstrap';

export interface InputProps extends RInputProps {
  label?: string;
  errors?: string | boolean | React.ReactNode;
  feedback?: string | React.ReactNode;
  hideErrors?: boolean;
  containerClassName?: string
  required?: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIconProps?: InputGroupTextProps;
  leftIconProps?: InputGroupTextProps;
  formGroupProps?: FormGroupProps;
  customInput?: React.ReactNode;
  note?: string;
}
interface WithForwardRefType extends React.FC<InputProps> {
  (props: InputProps): ReturnType<React.FC<InputProps>>
}

const formatErrors = (errors: any) => (
  <ul>
    {errors?.map((error: any) => <li key={error}>{error}</li>)}
  </ul>
);

const Input: WithForwardRefType = forwardRef<HTMLInputElement, InputProps>(
  ({
    label, id, type, feedback, errors,
    className, hideErrors, containerClassName, required,
    formGroupProps = {}, rightIcon, leftIcon, rightIconProps, leftIconProps,
    customInput, note,
    ...rest
  }, ref) => (
    <FormGroup {...formGroupProps}>
      <InputGroup className={classNames({
        'is-invalid': !!errors,
      })}
      >
        {leftIcon && (
          <InputGroupText tabIndex={-1} {...(leftIconProps || {})}>
            {leftIcon}
          </InputGroupText>
        )}
        <FormGroup noMargin floating>
          {customInput || (
            <RInput
              className={className}
              id={id}
              innerRef={ref}
              type={type}
              invalid={!!errors}
              {...rest}
            />
          )}
          <Label for={id} className={errors ? 'error-input-label' : 'input-label'}>
            {label}
            {required && (
              <span className="text-danger">*</span>
            )}
          </Label>
        </FormGroup>
        {rightIcon && (
          <InputGroupText tabIndex={-1} {...(rightIconProps || {})}>
            {rightIcon}
          </InputGroupText>
        )}
      </InputGroup>
      {note && (
        <FormText className="text-placeholder b5 mt-1 mx-2 small" tag="div">
          {note}
        </FormText>
      )}
      <FormFeedback>
        {hideErrors ? null : formatErrors(errors)}
      </FormFeedback>
    </FormGroup>
  ),
);

Input.displayName = 'Input';

export default Input;
