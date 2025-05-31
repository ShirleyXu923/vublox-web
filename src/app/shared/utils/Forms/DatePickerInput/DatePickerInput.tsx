import classNames from 'classnames';
import { range } from 'lodash';
import moment from 'moment';
import React, { forwardRef, useContext, useRef } from 'react';
import ReactDatePicker, { ReactDatePickerCustomHeaderProps, ReactDatePickerProps } from 'react-datepicker';
import TimePicker, { TimePickerProps } from 'react-time-picker';
import { LooseValue } from 'react-time-picker/dist/cjs/shared/types';
import { Button } from 'reactstrap';

import AppContext from '@app/AppContext';
import {
  CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon,
  CloseIcon,
} from '@shared/icons';

import Input, { InputProps } from '../Input/Input';
import 'react-time-picker/dist/TimePicker.css';

interface DatePickerBaseProps {
  name?: string;
  label: string;
  required?: boolean;
  errors?: string | boolean | React.ReactNode;
  inputProps?: InputProps;
  disabled?: boolean;
  leftIconPosition?: boolean; // Add this prop
}

type DatePickerProps =
  | {
    type: 'time';
    wrapperClassName?: string | undefined;
    selected?: LooseValue | undefined;
    onChange: (value: Date, event?: any) => void;
    leftIconPosition?: boolean; // Add this prop
  } & Omit<TimePickerProps, 'onChange'> & DatePickerBaseProps
  | {
    type?: 'date' | 'datetime';
    leftIconPosition?: boolean; // Add this prop
  } & ReactDatePickerProps & DatePickerBaseProps;
// eslint-disable-next-line react/display-name
const CustomInput = forwardRef(({
  value, label, onClick, Icon, onChange, required,
  errors, inputProps, disabled, onFocus, leftIconPosition,
}: any, ref) => (
  <Input
    ref={ref}
    label={label}
    placeholder={label}
    value={value}
    onClick={onClick}
    onChange={onChange}
    required={required}
    disabled={disabled}
    leftIcon={leftIconPosition ? (
      <Icon />
    ) : null}
    rightIcon={leftIconPosition ? null : (
      <Icon />
    )}
    errors={errors}
    onFocus={onFocus}
    {...(inputProps || {})}
  />
));

function CustomHeader({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) {
  const getMonth = (d: Date) => +moment(d, 'DD/MM/YYYY').format('MM') - 1;
  const getYear = (d: Date) => moment(d, 'DD/MM/YYYY').format('YYYY').replace(/^0+/, '');
  const months = moment.months();
  const years = range(1, +getYear(new Date()) + 1, 1);

  return (
    <div
      className="d-flex align-items-center justify-content-center pt-1 pb-2"
    >
      <select
        value={months[getMonth(date)]}
        onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
      >
        {months.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        value={getYear(date)}
        onChange={({ target: { value } }) => changeYear(+value)}
      >
        {years.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <Button size="sm" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="ms-2 p-1">
        <ChevronLeftIcon height={14} />
      </Button>
      <Button size="sm" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="p-1">
        <ChevronRightIcon height={14} />
      </Button>
    </div>
  );
}

function DatePickerInput(props: DatePickerProps) {
  const inputRef = useRef(null);
  const {
    label, type, required,
    errors, inputProps, disabled, onChange, wrapperClassName, leftIconPosition,
  } = props;
  const isTimeInput = type === 'time';
  const { locale } = useContext(AppContext);

  if (isTimeInput) {
    const { selected, format } = props;
    return (
      <Input
        label={label}
        disabled={disabled}
        required={required}
        rightIcon={(<ClockIcon />)}
        errors={errors}
        inputProps={inputProps}
        customInput={(
          <TimePicker
            className={classNames('w-100 form-control', wrapperClassName)}
            clockIcon={null}
            disableClock
            locale={locale as any}
            format="hh:mm:ss a"
            maxDetail="second"
            clearIcon={<CloseIcon />}
            value={selected || '00:00:00'}
            {...props}
            onChange={(v) => {
              const time = moment(v, format || 'hh:mm:ss a');
              if (!time.isValid()) {
                onChange(null as any, null);
                return;
              }
              onChange(time.toDate(), null);
            }}
          />
        )}
      />
    );
  }

  const isDateTimeInput = type === 'datetime';
  return (
    <ReactDatePicker
      customInput={(
        <CustomInput
          inputRef={inputRef}
          label={label}
          disabled={disabled}
          required={required}
          Icon={CalendarIcon}
          errors={errors}
          inputProps={inputProps}
          leftIconPosition={leftIconPosition}
        />
      )}
      wrapperClassName={classNames('w-100', wrapperClassName)}
      showTimeSelect={isTimeInput || isDateTimeInput}
      showTimeSelectOnly={isTimeInput}
      dateFormat={isTimeInput ? 'hh:mm:ss aa' : 'dd/MM/YYYY'}
      timeFormat="hh:mm aa"
      popperModifiers={[
        {
          name: 'arrow',
          options: {
            padding: ({ popper, reference }: any) => ({
              right: Math.min(popper.width, reference.width) - 24,
            }),
          },
          fn(state) {
            return state;
          },
        },
      ]}
      {...props}
      onChangeRaw={(date) => {
        const newRaw = moment(date.currentTarget?.value, 'DD/MM/YYYY').toDate();
        // eslint-disable-next-line no-restricted-globals
        if (newRaw instanceof Date && !isNaN(newRaw as any)) {
          onChange(newRaw, {} as any);
        }
      }}
      onChange={(v: Date, e: any) => {
        if (!v) {
          onChange(v, e);
          return;
        }

        const newRaw = moment(e?.target.value, 'DD/MM/YYYY').toDate();
        // eslint-disable-next-line no-restricted-globals
        if (newRaw instanceof Date && !isNaN(newRaw as any)) {
          onChange(newRaw, e);
          return;
        }

        const offsetDate = new Date(v);
        offsetDate.setHours(0);
        offsetDate.setMinutes(0);
        offsetDate.setSeconds(0);
        onChange(offsetDate, e);
      }}
      renderCustomHeader={CustomHeader}

    />
  );
}

export default DatePickerInput;
