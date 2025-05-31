import './StartModal.scss';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';

import { getMyEventsRequest, updateEventRequest } from '@reducers/event/EventAction';
import { handleError } from '@services/ErrorHandler';
import { Button } from '@shared/buttons/Button';
import TimezonePicker from '@shared/components/TimezonePicker/TimezonePicker';
import {
  dateToCalendar,
  dateToTime,
  getFormData,
  serverDateTimeFormat,
  utcToTimezoneDate,
} from '@shared/helpers';
import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';
import DatePickerInput from '@shared/utils/Forms/DatePickerInput/DatePickerInput';

interface ModalProps {
  modal?: boolean;
  toggle: () => void;
  data?: any;
}

interface FormType {
  timezone: any;
  started_at: Date | null;
  started_time: Date | null;
}

function StartModal({
  modal,
  toggle,
  data,
}: ModalProps) {
  const i18n = useTranslation('contentManager');
  const { logo } = useAppTheme();
  const dispatch = useDispatch<any>();
  const [ timezone ] = useState(moment.tz.guess());
  const [ form, setForm ] = useState<FormType>({
    timezone: { label: `(GMT${moment.tz(timezone).format('Z')}) ${timezone}`, value: timezone },
    started_at: new Date(),
    started_time: new Date(),
  });

  useEffect(() => {
    const date = data?.started_at ? utcToTimezoneDate(data?.started_at, data.timezone) : null;
    setForm({
      ...form,
      started_at: date,
      started_time: date,
      timezone: { label: `(GMT${moment.tz(data.timezone).format('Z')}) ${data.timezone}`, value: data.timezone },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data ]);

  const handleSubmit = async () => {
    try {
      if (!form.started_at || !form.started_time) return;

      const updateData = {
        timezone: form.timezone.value,
        started_at: serverDateTimeFormat(form.started_at, form.started_time, form.timezone.value),
      };

      const formData = getFormData(updateData);

      await dispatch(updateEventRequest(data?.id, formData)).$promise;
      toast.success(i18n.events.endedAtUpdated);
      await dispatch(getMyEventsRequest({})).$promise;
      toggle();
    } catch (error: any) {
      handleError(error);
    }
  };

  return (
    <Modal
      className="start-modal-custom"
      isOpen={modal}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        <div className="s1">{i18n.events.editStartDate}</div>
      </ModalHeader>
      <ModalBody>
        <div className="event">
          <div className="banner">
            <img className="image" src={data?.banner_url ? data?.banner_url?.md : logo} alt="" />
          </div>
          <div className="info">
            <div className="b2">{data?.name}</div>
            <div className="b5 text-truncate description" style={{ maxWidth: '560px' }}>{data?.description}</div>
            <div className="caption1">
              <span>{dateToCalendar(data?.started_at)}, {dateToTime(data?.started_at)}</span>
              <div className="seperator" />
              <span>{data?.location?.name}</span>
            </div>
          </div>
        </div>

        <Row className="mt-4">
          <Col md={12}>
            <TimezonePicker
              onChange={(v: any) => {
                setForm(s => ({ ...s, timezone: v }));
              }}
              value={form.timezone}
            />
          </Col>
          <Col md={6}>
            <DatePickerInput
              label={i18n.events.startDate}
              selected={form?.started_at}
              required
              onChange={(date) => setForm({
                ...form,
                started_at: date as any,
              })}
            />
          </Col>
          <Col md={6}>
            <DatePickerInput
              label={i18n.events.startTime}
              required
              type="time"
              value={dateToTime(form?.started_time as any)}
              onChange={(date) => {
                if (date) {
                  setForm({
                    ...form,
                    started_time: date,
                  });
                }
              }}
            />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          isForm
          label={i18n.events.saveChanges}
          onClick={handleSubmit}
          disabled={!form?.started_at || !form?.started_time}
        />
      </ModalFooter>
    </Modal>
  );
}

export default StartModal;
