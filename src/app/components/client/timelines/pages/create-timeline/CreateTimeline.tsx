import './CreateTimeline.scss';

import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Alert,
  Button,
  Col, Container, Label, Row, Spinner, TabContent, TabPane,
} from 'reactstrap';

import { IRootState } from '@app/store';
import LocationPicker from '@components/client/create-post/components/location-picker/LocationPicker';
import { getEventRequest } from '@reducers/event/EventAction';
import { getLocationRequest } from '@reducers/location/LocationAction';
import { getOrganizationRequest } from '@reducers/organization/OrganizationAction';
import { createTimelineRequest, getTimelineRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import StepProgress from '@shared/components/StepProgress/StepProgress';
import { getFormData } from '@shared/helpers';
import { InfoIcon } from '@shared/icons';
import PostableDropdown from '@shared/utils/postable-dropdown/PostableDropdown';

import { TimelineForm } from '../../components/timeline-form';

function CreateTimeline() {
  const i18n = LocaleService.getTranslations('createTimeline');
  const navigate = useNavigate();
  const params = useParams();
  const [ searchParams ] = useSearchParams();
  const dispatch = useDispatch<any>();
  const [ errors, setErrors ] = useState<any>({});
  const account = useSelector((state: IRootState) => state.Auth.account);
  const [ step, setStep ] = useState(0);
  const [ timezone ] = useState(moment.tz.guess());
  const [ timelineable, setTimelineable ] = useState<any>(null);
  const [ form, setForm ] = useState({
    cover_image: null,
    name: '',
    description: '',
    started_at: new Date(),
    category_id: '',
    privacy_option: 'public',
    ownerable_id: account?.id || null,
    ownerable_type: account?.type === 'user' ? 'Client' : 'Organization',
    timelineable_id: '',
    timelineable_type: '',
    tags: [],
    location: {
      name: '',
      address: '',
      latitude: null,
      longitude: null,
      country_code: '',
    },
    timezone: { label: `(GMT${moment.tz(timezone).format('Z')}) ${timezone}`, value: timezone },
  });
  const [ loading, setLoading ] = useState(false);
  const isSmallScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const isButtonActive = form?.name
    && form?.privacy_option && form?.started_at
    && form?.category_id;

  const handleInputChange = (evt: any) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      setErrors({});
      const formData = getFormData({
        ...form,
        timezone: form.timezone.value,
        timelineable_id: timelineable?.id,
        timelineable_type: timelineable?.type,
      });
      const { data } = await dispatch(createTimelineRequest(formData)).$promise;
      toast.success(i18n.success.timelineCreated);
      navigate(`/timelines/${data?.timelineable_id || data?.timeline?.id}/timeblocks?type=${data?.timelineable_type || ''}&data_id=${data?.timeline?.id}`);
    } catch (error: any) {
      const { response } = error;
      const { errors: errs } = response?.data || {};
      if (response?.status === 422) {
        setErrors(errs);
        handleError(error);
        return;
      }

      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimelineableChange = (item: any) => {
    if (!item || !item?.type) {
      setTimelineable(null);
      setForm({
        ...form,
        location: {
          name: '',
          address: '',
          latitude: null,
          longitude: null,
          country_code: '',
        },
      });
      return;
    }

    setTimelineable(item);
  };

  const loadEvent = async (id: string | null) => {
    if (!id) return;

    try {
      const result = await dispatch(getEventRequest(id)).$promise;

      const timelineableData = result?.data;

      setTimelineable({
        ...timelineableData,
        type: 'Event',
      });
    } catch (error: any) {
      handleError(error);
    }
  };

  const loadTimeline = async (id: string | null) => {
    if (!id) return;

    try {
      const result = await dispatch(getTimelineRequest(id)).$promise;

      const timelineableData = result?.data?.timeline;

      setTimelineable({
        ...timelineableData,
        type: 'Timeline',
      });
    } catch (error: any) {
      handleError(error);
    }
  };

  const loadOrganization = async (id: string | null) => {
    if (!id) return;

    try {
      const result = await dispatch(getOrganizationRequest(id)).$promise;

      const timelineableData = result?.data;

      setTimelineable({
        ...timelineableData,
        type: 'Organization',
      });
    } catch (error: any) {
      handleError(error);
    }
  };

  const loadLocation = async (id: string | null) => {
    if (!id) return;

    try {
      const result = await dispatch(getLocationRequest(id)).$promise;

      const timelineableData = result?.data;

      setTimelineable({
        name: timelineableData.name,
        location: timelineableData,
        type: 'Location',
      });
    } catch (error: any) {
      handleError(error);
    }
  };

  useEffect(() => {
    const timelineableId = searchParams.get('timelineable_id');
    const timelineableType = searchParams.get('timelineable_type');

    if (timelineableType === 'Event') {
      loadEvent(timelineableId);
    }

    if (timelineableType === 'Timeline') {
      loadTimeline(timelineableId);
    }

    if (timelineableType === 'Organization') {
      loadOrganization(timelineableId);
    }

    if (timelineableType === 'Location') {
      loadLocation(timelineableId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!timelineable?.type) {
      return;
    }

    if (timelineable?.type === 'location' || timelineable?.type === 'custom_location') {
      setForm({
        ...form,
        timelineable_id: params?.timelineable_id || '',
        timelineable_type: params?.timelineable_type || '',
        location: timelineable || form?.location,
      });
    } else {
      setForm({
        ...form,
        timelineable_id: params?.timelineable_id || '',
        timelineable_type: params?.timelineable_type || '',
        location: timelineable?.location ? timelineable?.location : form?.location,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ timelineable ]);

  return (
    <Container className="main-container">
      <Container className="create-timeline">
        <Row className="justify-content-center">
          <Col md={11}>
            <h2 className="text-center">{i18n.title}</h2>
            <StepProgress
              steps={2}
              currentStep={step}
              onChange={setStep}
            />
            <TabContent activeTab={step}>
              <TabPane tabId={0}>
                <TimelineForm
                  hideSubmit
                  loading={loading}
                  form={form}
                  onInputChange={handleInputChange}
                  onSubmit={handleFormSubmit}
                  errors={errors}
                />
                <Button
                  color="primary"
                  block={!isSmallScreen}
                  className="mt-5 submit-and-next-button-mobile"
                  disabled={!isButtonActive}
                  onClick={() => setStep(1)}
                >
                  {i18n.button.next}
                </Button>
              </TabPane>
              <TabPane tabId={1}>
                <Alert color="highlight" className="d-inline-block mt-2">
                  <div className="d-flex align-items-center b5" style={{ color: 'var(--bs-body-bg-dark)' }}>
                    <InfoIcon
                      fill="var(--bs-primary)"
                      className="me-2"
                    />
                    {i18n.label.timelineDescription}
                  </div>
                </Alert>

                <Label className="d-block">
                  {i18n.label.timelineableDescription}
                </Label>

                <PostableDropdown
                  value={timelineable}
                  onSelect={handleTimelineableChange}
                />

                {timelineable && (
                  <div className="mt-5">
                    <LocationPicker
                      code={(form.location).country_code}
                      latitude={(form.location).latitude || 0}
                      longitude={(form.location).longitude || 0}
                      handleInputChange={handleInputChange}
                      defaultVerified={!!(form.location as any)?.verified}
                    />
                  </div>
                )}

                <Button
                  color="primary"
                  block={!isSmallScreen}
                  className="mt-5 submit-and-next-button-mobile"
                  disabled={!form?.location?.name || !form?.location?.country_code || loading}
                  onClick={handleFormSubmit}
                >
                  {i18n.button.createTimeline}
                  {loading && <Spinner size="sm" className="ms-2" />}
                </Button>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default CreateTimeline;
