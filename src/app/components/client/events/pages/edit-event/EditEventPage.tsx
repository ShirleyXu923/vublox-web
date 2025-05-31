import { AxiosResponse } from 'axios';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  // useRef,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Alert,
  Button,
  Col,
  Container,
  FormGroup,
  FormText,
  Label,
  Row,
  Spinner,
  TabContent,
  TabPane,
} from 'reactstrap';

import { IRootState } from '@app/store';
import LocationPicker from '@components/client/create-post/components/location-picker/LocationPicker';
import { getEventRequest, updateEventRequest, getCoCreatorsRequest } from '@reducers/event/EventAction';
import { contributeToTimelineRequest, deleteTimeblockableRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import AccountSwitcher from '@shared/components/AccountSwitcher/AccountSwitcher';
import StepProgress from '@shared/components/StepProgress/StepProgress';
import { getFormData } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { CloseIcon, InfoIcon } from '@shared/icons';
import Media from '@shared/icons/Media';
// import { CloseIcon, UploadIcon } from '@shared/icons';
// import FileUploader, { FileUploaderRef } from '@shared/utils/FileUploader/FileUploader';
import Dropzone from '@shared/utils/Dropzone/Dropzone';
import CategoryInput from '@shared/utils/Forms/CategoryInput/CategoryInput';
import Input from '@shared/utils/Forms/Input/Input';
import Select from '@shared/utils/Forms/Select/Select';
import TagsInput from '@shared/utils/Forms/TagsInput/TagsInput';
import PostableDropdownMultiple from '@shared/utils/postable-dropdown/PostableDropdownMultiple';

import EventTypeDetailsTab from '../create-event/components/event-type-details-tab/EventTypeDetailsTab';

import './EditEventPage.scss';

type ApiError = {
  response?: {
    status: number;
    data?: {
      errors?: Record<string, string[]>;
    };
  };
};

function EditEventPage() {
  const i18n = useTranslation('createEvent');
  const user = useSelector((state: IRootState) => state.Auth.user) as any;
  const account = useSelector((state: IRootState) => state.Auth.account) as any;
  const params = useParams();
  const [ step, setStep ] = useState(0);
  const [ timezone ] = useState(moment.tz.guess());
  const [ data, setData ] = useState({
    name: '',
    description: '',
    banner: null,
    banner_preview: null,
    category_id: null,
    category: null,
    privacy_option: 'public',
    type: 'live',
    location: null,
    start_date: null,
    end_date: null,
    timezone: { label: `(GMT${moment.tz(timezone).format('Z')}) ${timezone}`, value: timezone },
    ownerable_id: user.id,
    ownerable_type: 'Client',
    eventable_id: null,
    eventable_type: null,
  });
  const [ tags, setTags ] = useState([]);
  const [ coCreators, setCoCreators ] = useState([]);
  const [ eventable, setEventable ] = useState<any>(null);
  const [ eventables, setEventables ] = useState([]);
  const [ errors, setErrors ] = useState<any>({});
  const [ loading, setLoading ] = useState(false);
  // const bannerUploader = useRef<FileUploaderRef>(null);
  const dispatch = useDispatch<any>();
  const [ pageLoading, setPageLoading ] = useState(true);
  const navigate = useNavigate();
  const { hash } = useLocation();
  const isSmallScreen = useMediaQuery({ query: '(max-width: 575px)' });

  const handleInputChange = (
    { target }: any) => {
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
      if (!params.id) {
        toast.error('Event ID is missing');
        return;
      }

      const formData = getFormData({
        ...data,
        tags: tags?.map((t: any) => t.value),
        co_creators: coCreators?.map((c: any) => ({
          creatable_id: c.value,
          creatable_type: c.type,
        })),
        timezone: data.timezone.value,
      });
      await dispatch(updateEventRequest(params.id || '', formData)).$promise;
      toast.success(i18n.success.saveChanges);
      navigate(`/events/${params.id}`);
    } catch (err: any) {
      const { response } = err;
      const { errors: errs } = response?.data || {};
      if (response?.status === 422) {
        setErrors(errs || {});
        handleError(err as ApiError);
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
      })
      .catch((error: any) => {
        handleError(error);
        callback([]);
      });
  };

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
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

    const loc = item.type !== 'location' ? item.location : item;

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

  const addEventable = async (item: any, type: string) => {
    try {
      const fd = {
        contributable_id: item.id,
        contributable_type: type === 'custom_location' ? 'custom_location' : type.charAt(0).toUpperCase() + type.slice(1),
        contribute_id: params.id,
        contribute_type: 'Event',
        custom_location: type === 'custom_location' ? item.name : null,
      };

      const formData = getFormData(fd);

      await dispatch(contributeToTimelineRequest(formData)).$promise;
      const response = await dispatch(getEventRequest(params.id || '')).$promise;

      const event = response?.data;

      setEventables(event?.timeblocks);
    } catch (e: any) {
      handleError(e);
    }
  };

  const handleDeleteEventable = async (id: string) => {
    try {
      await dispatch(deleteTimeblockableRequest(id)).$promise;
      const response = await dispatch(getEventRequest(params.id || '')).$promise;

      const event = response?.data;

      setEventables(event?.timeblocks);
    } catch (error) {
      handleError(error);
    }
  };

  const loadEvent = useCallback(async () => {
    try {
      if (params.id) {
        setPageLoading(true);
        const response = await dispatch(getEventRequest(params.id)).$promise;

        const event = response?.data;

        if (event.ownerable_id !== user.id && event.ownerable_id !== account.id) {
          navigate('/errors/404');
        }

        setData({
          ...data,
          name: event?.name,
          description: event?.description,
          banner_preview: event?.banner?.lg as any,
          privacy_option: event?.privacy_option,
          category_id: event?.category?.id as any,
          category: event?.category as any,
          banner: null,
          type: event?.type,
          start_date: event?.started_at ? new Date(event?.started_at) as any : null,
          end_date: event?.ended_at ? new Date(event?.ended_at) as any : null,
          ownerable_id: event?.ownerable_id,
          ownerable_type: event?.ownerable_type,
          timezone: { label: `(GMT${moment.tz(event.timezone).format('Z')}) ${event.timezone}`, value: event.timezone },
          location: event?.location,
          eventable_id: event?.eventable_id,
          eventable_type: event?.eventable_type,
        });

        setEventables(event?.timeblocks);

        if (event.eventable) {
          setEventable(event.eventable);
        }

        setTags(
          event?.tags?.map((tag: any) => {
            const newTag = {
              label: tag,
              value: tag,
            };

            return newTag;
          }) as any,
        );

        setCoCreators(
          event?.coCreators?.map((c: any) => {
            const newCoCreator = {
              label: c?.creator?.name,
              value: c?.creator?.id,
              type: c?.type,
            };

            return newCoCreator;
          }),
        );
      }
    } catch (error) {
      handleError(error, navigate);
    } finally {
      setPageLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ params.id, dispatch ]);

  useEffect(() => () => {
    if (data.banner_preview) {
      URL.revokeObjectURL(data.banner_preview);
    }
  }, [ data.banner_preview ]);

  useEffect(() => {
    loadEvent();
  }, [ loadEvent ]);

  useEffect(() => {
    if (!eventable?.type) {
      return;
    }

    setData({
      ...data,
      eventable_id: eventable?.id,
      eventable_type: eventable.type[0].toUpperCase() + eventable.type.slice(1),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ eventable ]);

  useEffect(() => {
    const st = hash.split('?');
    const h = st[0].split('-');
    const s = h[1];
    setStep(+s - 1);
  }, [ hash ]);

  return (
    <Container className="main-container edit-event-page">
      {!pageLoading && (
        <Container>
          <Row className="justify-content-center">
            <Col md={11}>
              <h2 className="text-center">{i18n.label.editEvent}</h2>

              <StepProgress
                steps={3}
                currentStep={step}
                onChange={(s: any) => navigate(s - step)}
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
                          <small className="text-muted">
                            {`${data.name?.length}/100`}
                          </small>
                        </FormText>
                      )}
                      onChange={handleInputChange}
                      maxLength={100}
                      errors={errors.name}
                      value={data?.name}
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
                        value={data?.description}
                      />
                      <Label for="description">{data.description ? i18n.label.description : i18n.label.describeWhatYourEventIsAbout}
                        {/* <span className="text-danger">*</span> */}
                      </Label>
                      <FormText>
                        <small className="text-muted">
                          {`${data.description?.length || 0}/1,000`}
                        </small>
                      </FormText>
                    </FormGroup>

                    {/* {data.banner_preview ? (
                      <div className="w-100 p-3 position-relative">
                        <img src={data.banner_preview} className="banner" alt="Banner" />
                        <Button
                          color="danger"
                          className="btn-delete"
                          onClick={removeBanner}
                        >
                          <CloseIcon width="16" fill="var(--bs-body-color)" />
                        </Button>
                      </div>
                    ) : (
                      <div className="media-button">
                        <Button
                          color="link"
                          className="btn-upload d-flex align-items-center p-2"
                          onClick={() => bannerUploader.current?.open()}
                        >
                          <>
                            <UploadIcon className="me-2" />
                            {i18n.label.uploadBanner}
                          </>
                        </Button>
                      </div>
                    )} */}
                  </div>

                  {/* <FileUploader
                    ref={bannerUploader}
                    onDrop={(ac) => handleFileAdded('banner', ac)}
                    onTypeError={(error: string) => {
                      setErrors({
                        ...errors,
                        banner: [ error ],
                      });
                    }}
                    accept={{
                      'image/*': [ '.jpeg', '.jpg', '.png' ],
                    }}
                    acceptedTypes={{
                      'image/png': [ '.png' ],
                      'image/jpeg': [ '.jpg', '.jpeg' ],
                    }}
                    maxSize={5e7}
                  /> */}

                  {(data?.banner as any)?.md
                    ? (
                      <div className="cover-image-preview">
                        <div className="b5">{i18n.label.uploadCoverPhoto}</div>
                        <img className="preview-image" src={(data?.banner as any)?.md} alt="" />
                        <div
                          className="close-button"
                          onClick={
                            () => handleInputChange({
                              target: {
                                name: 'banner',
                                value: '',
                              },
                            })
                          }
                        >
                          <CloseIcon />
                        </div>
                      </div>
                    )
                    : (
                      <Dropzone
                        single
                        defaultPreview={data.banner_preview}
                        onFileAdded={(e: File[]) => {
                          handleInputChange({
                            target: {
                              name: 'cover_image',
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
                    )}

                  <div className="mb-3">
                    {!pageLoading && (
                      <CategoryInput
                        defaultOption={data?.category ? {
                          label: (data?.category as any)?.name,
                          value: (data?.category as any)?.id,
                        } : null}
                        onChange={(e: any) => {
                          handleInputChange({ target: { name: 'category_id', value: e.value } } as any);
                        }}
                      />
                    )}
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
                    defaultValue={{ label: i18n.label.public, value: data?.privacy_option || 'public' }}
                    onChange={(v: any) => {
                      handleInputChange({ target: { name: 'privacy_option', value: v.value } } as any);
                    }}
                  />

                  {!pageLoading && (
                    <Select
                      async
                      label={i18n.label.coCreators}
                      placeholder={i18n.label.coCreators}
                      onChange={(v: any) => setCoCreators(v)}
                      isMulti
                      cacheOptions
                      defaultOptions
                      defaultValue={coCreators as any}
                      loadOptions={loadOrganizations}
                    />
                  )}

                  {!pageLoading && (
                    <TagsInput
                      classNamePrefix="react-select"
                      placeholder={i18n.label.tags}
                      onChange={(t: any) => setTags(t)}
                      maxLength={5}
                      defaultValue={tags}
                      components={{ IndicatorsContainer: () => null }}
                      isClearable
                    />
                  )}

                  <Button
                    color="primary"
                    block
                    disabled={!data.name || !data.category_id}
                    className="mt-5"
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

                  <Label className="d-block">
                    {i18n.label.eventableDescription}
                  </Label>

                  <PostableDropdownMultiple
                    postables={eventables}
                    onSelect={addEventable}
                    onRemove={handleDeleteEventable}
                  />

                  {(eventable || data?.location) && (
                    <div className="mt-5">
                      <LocationPicker
                        code={(data.location || eventable.location || eventable).country_code}
                        latitude={(data.location || eventable.location || eventable).latitude || 0}
                        longitude={(data.location || eventable.location
                          || eventable).longitude || 0}
                        handleInputChange={handleInputChange}
                        defaultVerified={!!(data.location as any)?.verified}
                      />
                    </div>
                  )}

                  <Button
                    color="primary"
                    block={!isSmallScreen}
                    disabled={!data?.location}
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
                  {!pageLoading && (
                    <EventTypeDetailsTab
                      data={data}
                      handleInputChange={handleInputChange}
                      errors={errors}
                    />
                  )}
                  <Button
                    color="primary"
                    block
                    disabled={!data.type || !data.location || loading}
                    className="mt-5"
                    onClick={handleSubmit}
                  >
                    {i18n.button.saveChanges}
                    {loading && <Spinner size="sm" className="ms-2" />}
                  </Button>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </Container>
      )}

    </Container>
  );
}

export default EditEventPage;
