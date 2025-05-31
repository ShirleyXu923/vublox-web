import './EndModal.scss';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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
} from '@shared/helpers';
import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';
import DatePickerInput from '@shared/utils/Forms/DatePickerInput/DatePickerInput';

interface ModalProps {
  modal?: boolean;
  toggle: () => void;
  data?: any;
  isEndNow?: boolean;
  query?: any;
}

interface FormType {
  timezone: any;
  ended_at: Date | null;
  ended_time: Date | null;
}

function EndModal({
  modal,
  toggle,
  data,
  isEndNow,
  query,
}: ModalProps) {
  const i18n = useTranslation('contentManager');
  const { logo } = useAppTheme();
  const dispatch = useDispatch<any>();
  const [ timezone ] = useState(moment.tz.guess());
  const [ form, setForm ] = useState<FormType>({
    timezone: { label: `(GMT${moment.tz(timezone).format('Z')}) ${timezone}`, value: timezone },
    ended_at: null,
    ended_time: null,
  });
  const [ loading, setLoading ] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!form.ended_at || !form.ended_time) return;

      const updateData = {
        type: 'past',
        timezone: form.timezone.value,
        ended_at: serverDateTimeFormat(form.ended_at, form.ended_time, form.timezone.value),
      };

      const formData = getFormData(updateData);

      await dispatch(updateEventRequest(data?.id, formData)).$promise;
      await dispatch(getMyEventsRequest(query)).$promise;
      toggle();
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm({
      timezone: moment.tz.guess(),
      ended_at: isEndNow ? new Date() : null,
      ended_time: isEndNow ? new Date() : null,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isEndNow ]);

  useEffect(() => {
    setForm((s: any) => ({
      ...s,
      timezone: { label: `(GMT${moment.tz(data.timezone).format('Z')}) ${data.timezone}`, value: data.timezone },
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data.timezone ]);

  return (
    <Modal
      className="end-modal-custom"
      isOpen={modal}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        <div className="s1">{i18n.events.endNow}</div>
      </ModalHeader>
      <ModalBody>
        <div className="b3">{i18n.events.endNowModalDescription}</div>
        <div className="event mt-5">
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
              label={i18n.events.endDate}
              selected={form?.ended_at}
              required
              onChange={(date) => setForm({
                ...form,
                ended_at: date,
              })}
            />
          </Col>
          <Col md={6}>
            <DatePickerInput
              label={i18n.events.endTime}
              required
              type="time"
              selected={form?.ended_time}
              onChange={(date) => {
                if (date) {
                  setForm({
                    ...form,
                    ended_time: date,
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
          label={i18n.events.endNow}
          onClick={handleSubmit}
          disabled={!form?.ended_at || !form?.ended_time || loading}
          loading={loading}
        />
      </ModalFooter>
    </Modal>
  );
}

export default EndModal;
