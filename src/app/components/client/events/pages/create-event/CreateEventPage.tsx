import { AxiosResponse } from 'axios';
import { startCase } from 'lodash';
import moment from 'moment-timezone';
import React, {
  useEffect,
  // ChangeEvent,
  // useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Alert,
  Button, Col, Container, FormGroup, FormText, Label, Row, Spinner, TabContent, TabPane,
} from 'reactstrap';

import { IRootState } from '@app/store';
import LocationPicker from '@components/client/create-post/components/location-picker/LocationPicker';
import appConfig from '@config/app';
import { createEventRequest, getCoCreatorsRequest, getEventRequest } from '@reducers/event/EventAction';
// import { getOrganizationsRequest } from '@reducers/organization/OrganizationAction';
import { getLocationRequest } from '@reducers/location/LocationAction';
import { getOrganizationRequest } from '@reducers/organization/OrganizationAction';
import { getTimelineRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import AccountSwitcher from '@shared/components/AccountSwitcher/AccountSwitcher';
import StepProgress from '@shared/components/StepProgress/StepProgress';
import { getFormData } from '@shared/helpers';
import { InfoIcon } from '@shared/icons';
import Media from '@shared/icons/Media';
// import {
//   CloseIcon, UploadIcon,
// } from '@shared/icons';
// import FileUploader , { FileUploaderRef } from '@shared/utils/FileUploader/FileUploader';
import Dropzone from '@shared/utils/Dropzone/Dropzone';
import CategoryInput from '@shared/utils/Forms/CategoryInput/CategoryInput';
import Input from '@shared/utils/Forms/Input/Input';
import Select from '@shared/utils/Forms/Select/Select';
import TagsInput from '@shared/utils/Forms/TagsInput/TagsInput';
import PostableDropdown from '@shared/utils/postable-dropdown/PostableDropdown';

import EventTypeDetailsTab from './components/event-type-details-tab/EventTypeDetailsTab';

import './CreateEventPage.scss';

function CreateEventPage() {
  const i18n = LocaleService.getTranslations('createEvent');
  const [ searchParams ] = useSearchParams();
  const account = useSelector((state: IRootState) => state.Auth.account) as any;
  const navigate = useNavigate();
  const [ step, setStep ] = useState(0);
  const [ timezone ] = useState(moment.tz.guess());
  const [ data, setData ] = useState({
    name: '',
    description: '',
    banner: null,
    banner_preview: null,
    category_id: null,
    privacy_option: 'public',
    type: 'live',
    location: null,
    start_date: new Date(),
    end_date: null,
    timezone: { label: `(GMT${moment.tz(timezone).format('Z')}) ${timezone}`, value: timezone },
    ownerable_id: account.id,
    ownerable_type: account?.type === 'user' ? 'Client' : 'Organization',
    eventable_id: null,
    eventable_type: null,
  });
  const [ tags, setTags ] = useState([]);
  const [ coCreators, setCoCreators ] = useState([]);
  const [ invitees, setInvitees ] = useState([]);
  const [ eventable, setEventable ] = useState<any>(null);
  const [ errors, setErrors ] = useState<any>({});
  const [ loading, setLoading ] = useState(false);
  // const bannerUploader = useRef<FileUploaderRef>(null);
  const { hash } = useLocation();
  const dispatch = useDispatch<any>();
  const isSmallScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const handleInputChange = ({ target }: any) => {
    setData((s: any) => ({
      ...s,
      [target.name]: target.value,
    }));
  };

  // const handleFileAdded = (key: string, res: File[]) => {
  //   setData((s: any) => ({
  //     ...s,
  //     [key]: res[0],
  //     [`${key}_preview`]: URL.createObjectURL(res[0]),
  //   }));
  // };

  const handleCreatorChange = (creator: any) => {
    setData((s: any) => ({
      ...s,
      ownerable_id: creator.id,
      ownerable_type: creator.type,
    }));
  };

  const handleSubmit = async () => {
    setErrors({});
    setLoading(true);
    try {
      const formData = getFormData({
        ...data,
        tags: tags.map((t: any) => t.value),
        co_creators: coCreators.map((c: any) => ({
          creatable_id: c.value,
          creatable_type: c.type,
        })),
        invitees: invitees.map((c: any) => ({
          invited_id: c.value,
          invited_type: c.type,
          status: 'pending',
        })),
        timezone: data.timezone.value,
      });
      const result = await dispatch(createEventRequest(formData)).$promise;
      toast.success(i18n.success.createEvent);
      setTimeout(() => {
        if (result?.data?.id) {
          navigate(`/events/${result?.data?.id}`);
        } else {
          navigate('/');
        }
      }, 300);
    } catch (err: any) {
      const { response } = err;
      const { errors: errs } = response?.data || {};
      if (response?.status === 422) {
        setErrors(errs);
        handleError(err);
        return;
      }

      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // const removeBanner = () => {
  //   setData((s: any) => ({
  //     ...s,
  //     banner: null,
  //     banner_preview: null,
  //   }));
  // };

  const loadOrganizations = (inputValue: string, callback: (options: object[]) => void) => {
    dispatch(getCoCreatorsRequest({ keyword: inputValue }))
      .$promise.then((res: AxiosResponse) => {
        callback(res.data.map((d: any) => ({
          label: d.name,
          key: d.id,
          value: d.id,
          type: d.type,
        })));
      });
  };

  const loadInvitees = (inputValue: string, callback: (options: object[]) => void) => {
    dispatch(getCoCreatorsRequest({ keyword: inputValue }))
      .$promise.then((res: AxiosResponse) => {
        callback(res.data.map((d: any) => ({
          label: d.name,
          key: d.id,
          value: d.id,
          type: d.type,
        })));
      });
  };
  const handleEventableChange = (item: any) => {
    if (!item || !item?.type) {
      setEventable(null);
      setData({
        ...data,
        location: null,
      });
      return;
    }

    setEventable(item);

    const loc = item.type !== 'location' && item.type !== 'custom_location' ? item.location : item;

    if (loc) {
      setData((s: any) => ({
        ...s,
        location: {
          id: loc.id,
          name: loc.name,
          address: loc.address,
          latitude: +loc.latitude,
          longitude: +loc.longitude,
          country_code: loc.country_code,
          verified: false,
        },
      }));
    }
  };

  const loadEvent = async (id: string | null) => {
    if (!id) return;

    try {
      const result = await dispatch(getEventRequest(id)).$promise;

      const eventableData = result?.data;

      setEventable({
        ...eventableData,
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

      const eventableData = result?.data?.timeline;

      setEventable({
        ...eventableData,
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

      const eventableData = result?.data;

      setEventable({
        ...eventableData,
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

      const eventableData = result?.data;

      setEventable({
        name: eventableData.name,
        location: eventableData,
        type: 'Location',
      });
    } catch (error: any) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (!eventable?.type) {
      return;
    }

    setData({
      ...data,
      eventable_id: eventable?.id,
      eventable_type: startCase(eventable.type) as any,
      location: eventable?.location ? eventable.location : data?.location,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ eventable ]);

  useEffect(() => {
    const st = hash.split('?');
    const h = st[0].split('-');
    const s = h[1];
    setStep(+s - 1);
  }, [ hash ]);

  useEffect(() => {
    const eventableId = searchParams.get('eventable_id');
    const eventableType = searchParams.get('eventable_type');

    if (eventableType === 'Event') {
      loadEvent(eventableId);
    }

    if (eventableType === 'Timeline') {
      loadTimeline(eventableId);
    }

    if (eventableType === 'Organization') {
      loadOrganization(eventableId);
    }

    if (eventableType === 'Location') {
      loadLocation(eventableId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mapkit.init({
      authorizationCallback(done) {
        done(appConfig.appleMapsToken as string);
      },
    });
  }, []);

  return (
    <Container className="main-container create-event-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={11}>
            <h2 className="text-center">{i18n.title}</h2>

            <StepProgress
              steps={3}
              currentStep={step}
              onChange={(s: any) => {
                navigate(s - step);
              }}
            />

            <TabContent activeTab={step}>
              <TabPane tabId={0}>
                <div className="event-form-group p-2 mb-4">
                  <AccountSwitcher onChange={handleCreatorChange} />

                  <Input
                    name="name"
                    label={data.name ? i18n.label.name : i18n.label.enterEventTitle}
                    placeholder={i18n.label.name}
                    required
                    formGroupProps={{ noMargin: true, className: 'mb-1' }}
                    rightIcon={(
                      <FormText>
                        <small className="text-muted text-placeholder" style={{ fontSize: '12px' }}>
                          {`${data.name.length}/100`}
                        </small>
                      </FormText>
                    )}
                    onChange={handleInputChange}
                    maxLength={100}
                    errors={errors.name}
                  />

                  <FormGroup floating>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      placeholder={i18n.label.description}
                      style={{ height: '120px' }}
                      maxLength={1000}
                      onChange={handleInputChange}
                    />
                    <Label for="description">{data.description ? i18n.label.description : i18n.label.describeWhatYourEventIsAbout}
                    </Label>
                    <FormText>
                      <small className="text-muted text-placeholder" style={{ fontSize: '12px' }}>
                        {`${data.description.length}/1,000`}
                      </small>
                    </FormText>
                  </FormGroup>
                </div>

                <Dropzone
                  single
                  onFileAdded={(e: File[]) => {
                    handleInputChange({
                      target: {
                        name: 'banner',
                        value: e[0],
                      },
                    });
                  }}
                  icon={<Media />}
                  label={i18n.label.uploadCoverPhoto}
                  uploadText={i18n.label.uploadText}
                  accept={{
                    'image/*': [ '.jpeg', '.jpg', '.png' ],
                  }}
                  acceptedTypes={{
                    'image/png': [ '.png' ],
                    'image/jpeg': [ '.jpg', '.jpeg' ],
                  }}
                  maxSize={5e7}
                />

                <div className="mb-3">
                  <CategoryInput
                    onChange={(e: any) => {
                      handleInputChange({ target: { name: 'category_id', value: e.value } } as any);
                    }}
                  />
                </div>

                <Select
                  options={[
                    { label: i18n.label.public, value: 'public' },
                    { label: i18n.label.private, value: 'private' },
                    { label: i18n.label.inviteOnly, value: 'invite-only' },
                  ]}
                  classNamePrefix="react-select"
                  placeholder={i18n.label.privacy}
                  required
                  defaultValue={{ label: i18n.label.public, value: 'public' }}
                  onChange={(v: any) => {
                    handleInputChange({ target: { name: 'privacy_option', value: v.value } } as any);
                  }}
                />

                {data?.privacy_option === 'invite-only' && (
                  <Select
                    async
                    label={i18n.label.invitees}
                    placeholder={i18n.label.invitees}
                    onChange={(v: any) => setInvitees(v)}
                    isMulti
                    cacheOptions
                    defaultOptions
                    loadOptions={loadInvitees}
                  />
                )}

                <Select
                  async
                  label={i18n.label.coCreators}
                  placeholder={i18n.label.coCreators}
                  onChange={(v: any) => setCoCreators(v)}
                  isMulti
                  cacheOptions
                  defaultOptions
                  loadOptions={loadOrganizations}
                />

                <TagsInput
                  label={i18n.label.tags}
                  classNamePrefix="react-select"
                  placeholder={i18n.label.tags}
                  onChange={(t: any) => setTags(t)}
                  maxLength={5}
                  components={{ IndicatorsContainer: () => null }}
                />

                <Button
                  color="primary"
                  block={!isSmallScreen}
                  disabled={!data.name || !data.category_id}
                  className="mt-5 submit-and-next-button-mobile"
                  onClick={() => {
                    setStep(1);
                    window.location.hash = 'step-2';
                  }}
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
                    {i18n.label.eventDescription}
                  </div>
                </Alert>

                <Label className="d-block mb-3">
                  {i18n.label.eventableDescription}
                </Label>

                <PostableDropdown
                  value={eventable}
                  onSelect={handleEventableChange}
                />

                {eventable && (
                  <div className="mt-5">
                    <LocationPicker
                      code={(data.location || eventable.location || eventable).country_code}
                      latitude={(data.location || eventable.location || eventable).latitude || 0}
                      longitude={(data.location || eventable.location || eventable).longitude || 0}
                      handleInputChange={handleInputChange}
                      defaultVerified={!!(data.location as any)?.verified}
                    />
                  </div>
                )}
                <Button
                  color="primary"
                  block={!isSmallScreen}
                  disabled={!data?.eventable_id || !data?.eventable_type}
                  className="mt-5 submit-and-next-button-mobile"
                  onClick={() => {
                    setStep(2);
                    window.location.hash = 'step-3';
                  }}
                >
                  {i18n.button.next}
                </Button>
              </TabPane>

              {/* Step 2 */}
              <TabPane tabId={2}>
                <EventTypeDetailsTab
                  data={data}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />
                <Button
                  color="primary"
                  block={!isSmallScreen}
                  disabled={!data.type || !data.location || loading}
                  className="mt-3 submit-and-next-button-mobile"
                  onClick={handleSubmit}
                >
                  {i18n.button.createEvent}
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

export default CreateEventPage;
