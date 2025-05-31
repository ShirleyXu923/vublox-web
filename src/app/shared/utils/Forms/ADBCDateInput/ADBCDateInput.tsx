import './ADBCDateInput.scss';
import moment from 'moment';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Col, Row } from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';

import DatePickerInput from '../DatePickerInput/DatePickerInput';
import Input from '../Input/Input';
import Select from '../Select/Select';

export interface ADBCDateInputRef {
  setTimePeriod: (value: 'AD' | 'BC') => void;
}

const MAX_BC_YEAR = 4712;

interface ADBCDateInputProps {
  name?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (e: any) => void;
  selected?: any;
  errors?: any;
  maxDate?: any;
}

function ADBCDateInput({
  name,
  label = 'Date',
  required,
  disabled,
  onChange,
  selected,
  errors,
  maxDate,
}: ADBCDateInputProps, ref: React.ForwardedRef<any>) {
  const i18n = useTranslation('dateInput');
  const [ selectedTimePeriod, setSelectedTimePeriod ] = useState<string>('AD');
  const [ year, setYear ] = useState<any>(null);
  const [ month, setMonth ] = useState<any>(null);
  const [ day, setDay ] = useState<any>(null);
  const [ months ] = useState(moment.months().map(m => ({
    label: m, value: moment().month(m).month(),
  })));

  const timePeriod = [
    {
      label: i18n.label.ad,
      value: 'AD',
    },
    {
      label: i18n.label.bc,
      value: 'BC',
    },
  ];

  useImperativeHandle(ref, () => ({
    setTimePeriod: (value: 'AD' | 'BC') => setSelectedTimePeriod(value),
  }));

  const getTimePeriod = () => {
    let tp: any = null;
    timePeriod.map((t) => {
      if (t.value === selectedTimePeriod) {
        tp = t;
      }

      return tp;
    });
    return tp;
  };

  const getMonthValue = () => {
    let monthValue = null;
    months.map((m: any) => {
      if (m.value === month) {
        monthValue = m;
      }

      return m;
    });
    return monthValue;
  };

  const onSetDay = (value: any) => {
    if (value > 31) {
      setDay(31);
      return;
    }

    if (value < 0) {
      setDay(0);
      return;
    }

    setDay(value);
  };

  const onSetYear = (value: any) => {
    if (value > MAX_BC_YEAR) {
      setYear(MAX_BC_YEAR);
      return;
    }

    if (value < 1) {
      setYear(1);
      return;
    }

    setYear(value);
  };

  useEffect(() => {
    if (day && month + 1 && year) {
      const date = new Date();
      const y = selectedTimePeriod === 'AD' ? Math.abs(year) : -Math.abs(year);
      date.setFullYear(y);
      date.setMonth(month);
      date.setDate(day);

      onChange({
        date,
        timePeriod: selectedTimePeriod,
      });
    } else if (selectedTimePeriod === 'BC') {
      onChange({
        date: null,
        timePeriod: selectedTimePeriod,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ day, month, year, selectedTimePeriod ]);

  return (
    <div className="ad-bc-date-input my-3">
      <div className="b3 text-body">{label}{required && <span className="text-danger">*</span>} </div>
      {selectedTimePeriod === 'AD'
        ? (
          <Row className="mt-2">
            <Col md={3} xs={6}>
              <Select
                value={getTimePeriod()}
                onChange={(v: any) => setSelectedTimePeriod(v.value)}
                isDisabled={disabled}
                label={i18n.label.timePeriod}
                placeholder={i18n.label.timePeriod}
                options={timePeriod}
              />
            </Col>
            <Col md={9} xs={6}>
              <DatePickerInput
                maxDate={maxDate}
                name={name}
                dateFormat="dd/MM/yyyy"
                selected={selected}
                label={label}
                placeholderText={label}
                disabled={disabled}
                onChange={(date: Date) => {
                  onChange({
                    date,
                    timePeriod: selectedTimePeriod,
                  });
                }}
                errors={errors}
                inputProps={{
                  note: i18n.label.format,
                }}
              />
            </Col>
          </Row>
        )
        : (
          <Row className="mt-2 grid-bc">
            <Col md={3}>
              <Select
                name="time_period"
                value={getTimePeriod()}
                onChange={(v: any) => setSelectedTimePeriod(v.value)}
                isDisabled={disabled}
                label={i18n.label.timePeriod}
                placeholder={i18n.label.timePeriod}
                options={timePeriod}
              />
            </Col>
            <Col md={3}>
              <Select
                onChange={(e: any) => setMonth(e.value)}
                isDisabled={disabled}
                label={i18n.label.month}
                placeholder={i18n.label.month}
                options={months}
                value={getMonthValue()}
              />
            </Col>
            <Col md={3}>
              <Input
                value={day}
                onChange={(e: any) => onSetDay(e.target.value)}
                disabled={disabled}
                label={i18n.label.day}
                placeholder={i18n.label.day}
                type="number"
                max={31}
              />
            </Col>
            <Col md={3}>
              <Input
                value={year}
                onChange={(e: any) => onSetYear(e.target.value)}
                disabled={disabled}
                label={i18n.label.year}
                placeholder={i18n.label.year}
                type="number"
                min={1}
                max={MAX_BC_YEAR}
              />
            </Col>
          </Row>
        )}
    </div>
  );
}
export default React.forwardRef<ADBCDateInputRef, ADBCDateInputProps>(ADBCDateInput);
