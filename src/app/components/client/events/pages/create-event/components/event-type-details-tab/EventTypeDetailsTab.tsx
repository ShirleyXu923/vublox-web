import classNames from 'classnames';
import React, { ChangeEvent, useEffect, useState } from 'react';
import useMediaQuery from 'react-responsive';
import {
  Col, FormGroup, Input, Label, Row,
} from 'reactstrap';

import LocaleService from '@services/LocaleService';
import TimezonePicker from '@shared/components/TimezonePicker/TimezonePicker';
import { serverDateTimeFormat, utcToTimezoneDate } from '@shared/helpers';
import {
  IndefiniteIcon, LiveIcon, PastIcon, UpcomingIcon,
} from '@shared/icons';
import { ADBCDateInput } from '@shared/utils/Forms/ADBCDateInput';
import DatePickerInput from '@shared/utils/Forms/DatePickerInput/DatePickerInput';
// import { LocationInput } from '@shared/utils/Forms/location-input';

interface EventTypeDetailsTabProps {
  data: any;
  errors: any;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function EventTypeDetailsTab({ data, errors, handleInputChange }: EventTypeDetailsTabProps) {
  const i18n = LocaleService.getTranslations('createEvent');
  const [ eventTypes ] = useState([
    { label: i18n.label.past, value: 'past', icon: PastIcon },
    { label: i18n.label.live, value: 'live', icon: LiveIcon },
    { label: i18n.label.upcoming, value: 'upcoming', icon: UpcomingIcon },
    { label: i18n.label.indefinite, value: 'indefinite', icon: IndefiniteIcon },
  ]);
  const [ showDatetimeInput, setShowDatetimeInput ] = useState(false);
  const [ startDate, setStartDate ] = useState(data.start_date ? utcToTimezoneDate(data.start_date,
    data.timezone?.value) : null);
  const [ endDate, setEndDate ] = useState(data.start_date ? utcToTimezoneDate(data.end_date,
    data.timezone?.value) : null);
  const [ startTime, setStartTime ] = useState(data.start_date ? utcToTimezoneDate(data.start_date,
    data.timezone?.value) : null);
  const [ endTime, setEndTime ] = useState(data.start_date ? utcToTimezoneDate(data.end_date,
    data.timezone?.value) : null);
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    if (data.type === 'indefinite') {
      handleInputChange({ target: 'time_period', value: null } as any);
      handleInputChange({ target: 'start_date', value: null } as any);
      setStartDate(null);
      setStartTime(new Date());
      setShowDatetimeInput(false);
    }

    if (data.type !== 'past') {
      handleInputChange({ target: 'end_date', value: null } as any);
      setEndDate(null);
      setEndTime(new Date());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data.type ]);

  useEffect(() => {
    handleInputChange({
      target: {
        name: 'start_date',
        value:
      startDate && startTime && data.timezone.value
        ? serverDateTimeFormat(startDate, startTime, data.timezone.value) : null,
      },
    } as any);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ startDate, startTime, data.timezone ]);

  useEffect(() => {
    handleInputChange({
      target: {
        name: 'end_date',
        value:
      endDate && endTime && data.timezone.value
        ? serverDateTimeFormat(endDate, endTime, data.timezone.value) : null,
      },
    } as any);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ endDate, endTime, data.timezone ]);

  return (
    <div className=" event-type-details-tab">
      <Row className="row-gap-2">
        {eventTypes.map((type) => (
          <Col lg={3} md={6} xs={6} key={type.value}>
            <input
              id={type.value}
              type="radio"
              name="type"
              value={type.value}
              checked={data.type === type.value}
              onChange={handleInputChange}
              className="btn-check"
            />
            <Label
              htmlFor={type.value}
              className={classNames(
                'btn btn-secondary form-check-label d-flex align-items-center w-100 py-3',
                { active: data.type === type.value })}
            >
              <type.icon width={20} height={20} fill="var(--bs-secondary-text)" className="me-2" />
              {type.label}
            </Label>
          </Col>
        ))}

        <div className="mt-3" />
        {(data.type === 'past' && !isSmScreen) && (
          <Label className="b3">
            {i18n.label.startDate}
            <span className="text-danger">*</span>
          </Label>
        )}

        {(data.type && data.type !== 'indefinite') && (
          <>
            <FormGroup noMargin className="col-md-6 col-6">
              <DatePickerInput
                label={i18n.label.startDate}
                selected={startDate}
                onChange={setStartDate}
                required
                minDate={data.type === 'upcoming' ? new Date() : null}
                maxDate={data.type === 'live' || data.type === 'past' ? new Date() : null}
                errors={errors.start_date}
              />
            </FormGroup>

            <FormGroup noMargin className="col-md-6 col-6">
              <DatePickerInput
                label={i18n.label.startTime}
                selected={startTime}
                onChange={setStartTime}
                type="time"
                required
                clearIcon={null}
              />
            </FormGroup>

            <Col md={12}>
              <div className="b5 mx-2 mt-n3 mb-3 small text-placeholder date-note">
                {i18n.label.dateInputMessage}
              </div>
            </Col>
          </>
        )}

        {data.type === 'past' && (
          <>
            {isSmScreen && (
              <Label className="b3">
                {i18n.label.endDate}
                <span className="text-danger">*</span>
              </Label>
            )}
            <FormGroup noMargin className="col-md-6 col-6">
              <DatePickerInput
                label={i18n.label.endDate}
                selected={endDate}
                onChange={setEndDate}
                required
                maxDate={new Date()}
                errors={errors.end_date}
                clearIcon={null}

              />
            </FormGroup>

            <FormGroup noMargin className="col-md-6 col-6">
              <DatePickerInput
                label={i18n.label.endTime}
                selected={endTime}
                onChange={setEndTime}
                type="time"
                required
                clearIcon={null}

              />
            </FormGroup>

            <Col md={12}>
              <div className="b5 mx-2 mt-n3 mb-3 small text-placeholder date-note">
                {i18n.label.dateInputMessage}
              </div>
            </Col>
          </>
        )}

        {data.type === 'indefinite' && (
          <>
            <FormGroup check className="col-md-12 ms-3 mb-4">
              <Input
                id="datetime"
                type="checkbox"
                onChange={({ target }) => {
                  setShowDatetimeInput(target.checked);
                }}
                checked={showDatetimeInput}
              />
              {' '}
              <Label htmlFor="datetime" check>
                {i18n.label.addStartDateTime}
              </Label>
            </FormGroup>

            {showDatetimeInput && (
              <>
                <FormGroup noMargin className="col-md-12">
                  <ADBCDateInput
                    onChange={(e: any) => setStartDate(e.date)}
                    errors={errors.start_date}
                    label={i18n.label.startDate}
                    selected={startDate}
                  />
                </FormGroup>

                <FormGroup noMargin className="col-md-12">
                  <DatePickerInput
                    label={i18n.label.startTime}
                    type="time"
                    selected={startTime}
                    onChange={setStartTime}
                    clearIcon={null}
                  />
                </FormGroup>
              </>
            )}
          </>
        )}

        {!!data.type && (
          <TimezonePicker
            onChange={(v: any) => {
              handleInputChange({ target: { name: 'timezone', value: v } } as any);
            }}
            value={data.timezone}
          />
        )}

        {/* <LocationInput
          defaultValue={data?.location}
          handleInputChange={handleInputChange}
        /> */}
      </Row>
    </div>
  );
}

export default React.memo(EventTypeDetailsTab);
