/* eslint-disable no-shadow */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/function-component-definition */
import classNames from 'classnames';
import React from 'react';
import RNSelect, {
  CSSObjectWithLabel,
  ControlProps,
  DropdownIndicatorProps,
  GroupBase, InputProps, MultiValueRemoveProps, PlaceholderProps, Props, SingleValueProps,
  StylesConfig, ValueContainerProps, components,
} from 'react-select';
import AsyncSelect, { AsyncProps } from 'react-select/async';
import CreateableSelect, { CreatableProps } from 'react-select/creatable';
import { FormFeedback, FormGroup, FormGroupProps } from 'reactstrap';

import { CaretDownIcon } from '@shared/icons';

export type SelectProps<Option, IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
  Async extends boolean = false,
  Createable extends boolean = false> = {
    async?: Async;
    label?: string;
    required?: boolean;
    createable?: Createable;
    errors?: string | boolean | React.ReactNode;
    formGroupProps?: FormGroupProps;
  } & (Async extends false ? Createable extends true ? CreatableProps<Option, IsMulti, Group>
    : Props<Option, IsMulti, Group>
    : AsyncProps<Option, IsMulti, Group>);

const styles: StylesConfig = {
  placeholder: (base: CSSObjectWithLabel, state: PlaceholderProps) => {
    const shouldFloatLabel = state.selectProps.menuIsOpen || state.hasValue;
    return shouldFloatLabel ? {
      display: 'none',
    } : base;
  },
  singleValue: (base: CSSObjectWithLabel, state: SingleValueProps) => {
    const shouldFloatLabel = state.selectProps.menuIsOpen || state.hasValue;
    return shouldFloatLabel ? {
      ...base,
      marginTop: '12px',
    } : base;
  },
  multiValue: (base: CSSObjectWithLabel, state: SingleValueProps) => {
    const shouldFloatLabel = state.selectProps.menuIsOpen || state.hasValue;
    return shouldFloatLabel ? {
      ...base,
      marginTop: '15px',
    } : base;
  },
  input: (base: CSSObjectWithLabel, state: InputProps) => {
    const shouldFloatLabel = state.selectProps.menuIsOpen || state.hasValue;
    return shouldFloatLabel ? {
      ...base,
      marginTop: '15px',
    } : base;
  },
  control: (base: CSSObjectWithLabel, state: ControlProps) => {
    const shouldFloatLabel = state.selectProps.menuIsOpen || state.hasValue;
    return shouldFloatLabel ? {
      ...base,
      paddingTop: '0.3rem !important',
      paddingLeft: '0.35rem !important',
      paddingRight: '0.35rem !important',
      height: '56px',
    } : {
      ...base,
      height: '56px',
    };
  },
  indicatorSeparator: (base: CSSObjectWithLabel) => ({
    ...base,
    alignSelf: 'center',
    height: '20px',
  }),
};

function DropdownIndicator<
Option,
IsMulti extends boolean = false,
Group extends GroupBase<Option> = GroupBase<Option>,
>(props: DropdownIndicatorProps<Option, IsMulti, Group>) {
  return (
    <components.DropdownIndicator {...props}>
      <CaretDownIcon width={18} height={18} fill="var(--bs-placeholder-color)" />
    </components.DropdownIndicator>
  );
}

function NewValueContainer<
Option,
IsMulti extends boolean = false,
Group extends GroupBase<Option> = GroupBase<Option>,
>(props: ValueContainerProps<Option, IsMulti, Group>) {
  const {
    selectProps, hasValue, children,
  } = props;
  const { required } = selectProps;
  const shouldFloatLabel = selectProps.menuIsOpen || hasValue;

  return (
    <components.ValueContainer {...props}>
      {shouldFloatLabel && (
        <p
          className="small text-uppercase react-select-floating-label"
          style={{
            position: 'absolute',
            left: '9px',
            top: '2px',
          }}
        >
          {(selectProps as any).label || selectProps.placeholder}
          {required && (
            <span className="text-danger">*</span>
          )}
        </p>
      )}
      {children}
    </components.ValueContainer>
  );
}

function NewPlaceholder<
Option,
IsMulti extends boolean = false,
Group extends GroupBase<Option> = GroupBase<Option>,
>(props: PlaceholderProps<Option, IsMulti, Group>) {
  const { children, selectProps } = props;
  const { required } = selectProps;

  return (
    <components.Placeholder {...props}>
      <span>
        {children}
        {required && (
          <span className="text-danger">*</span>
        )}
      </span>
    </components.Placeholder>
  );
}

function MultiValueRemove<
Option,
IsMulti extends boolean = false,
Group extends GroupBase<Option> = GroupBase<Option>,
>(props: MultiValueRemoveProps<Option, IsMulti, Group>) {
  const {
    children, data,
  } = props;
  const isDisabled = (data as any).disabled;
  return isDisabled ? null : (
    <components.MultiValueRemove {...props}>
      {children}
    </components.MultiValueRemove>
  );
}

function Select<
Option,
IsMulti extends boolean = false,
Group extends GroupBase<Option> = GroupBase<Option>,
Async extends boolean = false,
Creatable extends boolean = false,
>({
  async, createable, errors, formGroupProps, ...rest
}: SelectProps<Option, IsMulti, Group, Async, Creatable>) {
  let SelectComponent = async ? AsyncSelect : RNSelect;
  SelectComponent = createable ? CreateableSelect : SelectComponent;
  return (
    <FormGroup {...(formGroupProps || {})}>
      <SelectComponent
        classNamePrefix="react-select"
        className={classNames({
          'is-invalid': !!errors,
        })}
        {...rest}
        components={{
          ...rest.components,
          ValueContainer: NewValueContainer,
          Placeholder: NewPlaceholder,
          MultiValueRemove,
          DropdownIndicator,
        }}
        styles={{
          ...rest.styles,
          ...styles,
        }}
      />
      <FormFeedback className={classNames({
        'd-block': !!errors,
      })}
      >
        {errors}
      </FormFeedback>
    </FormGroup>
  );
}

export default Select;
