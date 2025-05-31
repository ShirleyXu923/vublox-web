import './EditTimeline.scss';

import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Col, Container, Row } from 'reactstrap';

import { IRootState } from '@app/store';
import { getTimeblockablesRequest, getTimelineRequest, updateTimelineRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { Button } from '@shared/buttons/Button';
import SortButton from '@shared/buttons/SortButton';
import { TimeblockablesComponent } from '@shared/components/TimeblockablesComponent';
import { getFormData } from '@shared/helpers';

import { TimelineForm } from '../../components/timeline-form';

function EditTimeline() {
  const i18n = LocaleService.getTranslations('createTimeline');
  const params = useParams();
  const dispatch = useDispatch<any>();
  const [ errors, setErrors ] = useState<any>({});
  const [ currentTab, setCurrentTab ] = useState('details');
  const [ isLoading, setIsLoading ] = useState(true);
  const [ formLoading, setFormLoading ] = useState(false);
  const user = useSelector((state: IRootState) => state.Auth.user);
  const account = useSelector((state: IRootState) => state.Auth.account);
  const timeblockables = useSelector((state: IRootState) => state.Timeline.timelineTimeblockables);
  const [ timezone ] = useState(moment.tz.guess());
  const [ form, setForm ] = useState({
    cover_image: null,
    name: '',
    description: '',
    started_at: null,
    category_id: '',
    privacy_option: 'public',
    ownerable_id: account?.id || null,
    ownerable_type: account?.type === 'user' ? 'Client' : 'Organization',
    tags: [],
    location: {
      name: '',
      address: '',
      latitude: null,
      longitude: null,
    },
    category: {},
    timezone: { label: `(GMT${moment.tz(timezone).format('Z')}) ${timezone}`, value: timezone },
  });
  const [ defaultValues, setDefaultValues ] = useState({
    tags: null,
    location: null,
  });
  const navigate = useNavigate();
  const [ sort, setSort ] = useState('DESC');
  const sortItems = [
    {
      label: i18n.label.latestToOldest,
      value: 'DESC',
    },
    {
      label: i18n.label.oldestToLatest,
      value: 'ASC',
    },
  ];

  const sortLabel = sort === 'DESC' ? i18n.label.latestToOldest : i18n.label.oldestToLatest;

  const handleInputChange = (evt: any) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setErrors({});
      const formData = getFormData({
        ...form,
        timezone: form.timezone.value,
      });

      await dispatch(updateTimelineRequest(params.id as string, formData)).$promise;
      toast.success(i18n.success.updatedTimeline);
      navigate(`/timelines/${params.id}`);
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
      setIsLoading(false);
    }
  };

  const getTimelineData = async () => {
    try {
      const res = await dispatch(getTimelineRequest(params.id, {})).$promise;
      let timeline = res?.data?.timeline;

      if (timeline?.ownerable_id !== user?.id && timeline?.ownerable_id !== account?.id) {
        navigate('/errors/404');
      }

      // Update tags
      const formattedTags = timeline?.tags?.map((tag: any) => (
        {
          label: tag.name,
          value: tag.name,
        } as any
      ));

      setDefaultValues({
        ...defaultValues,
        tags: formattedTags,
        location: timeline.location || null,
      });

      timeline = {
        ...timeline,
        tags: timeline?.tags?.map((tag: any) => tag.name),
        timezone: { label: `(GMT${moment.tz(timeline.timezone).format('Z')}) ${timeline.timezone}`, value: timeline.timezone },
      };

      setForm(timeline);
    } catch (error: any) {
      handleError(error, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  const timeblockablesRequest = async () => {
    const query = {
      sort,
    };
    await dispatch(getTimeblockablesRequest(params.id || '', query)).$promise;
  };

  const loadTimeblockables = async () => {
    try {
      setIsLoading(true);
      await timeblockablesRequest();
    } catch (error) {
      handleError(error, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  const changeTab = async (tab = 'details') => {
    if (tab === 'details') {
      await getTimelineData();
    }
    setCurrentTab(tab);
  };

  useEffect(() => {
    timeblockablesRequest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ sort ]);

  useEffect(() => {
    getTimelineData();
    loadTimeblockables();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="main-container">
      <Container className="edit-timeline">
        <Row className="justify-content-center">
          <Col md={11}>
            <h2 className="text-center">{i18n.label.editTimeline}</h2>

            <div className="page-tabs">
              <button type="button" className={`tab-button ${currentTab === 'details' ? 'b6 active' : 'b5'}`} onClick={() => changeTab('details')}>{i18n.label.details}</button>
              <button type="button" className={`tab-button ${currentTab === 'timeline' ? 'b6 active' : 'b5'}`} onClick={() => changeTab('timeline')}>{i18n.label.timeline}</button>
            </div>
          </Col>
          <Col md={11}>
            {!isLoading && (
              <div>
                {currentTab === 'details'
                  ? (
                    <TimelineForm
                      defaultValues={defaultValues}
                      loading={formLoading}
                      submitButtonText={i18n.button.saveChanges}
                      form={form}
                      onInputChange={handleInputChange}
                      onSubmit={handleFormSubmit}
                      errors={errors}
                    />
                  )
                  : (
                    <div className="timeblockables_wrapper">
                      <div className="d-flex justify-content-end mb-5">
                        <SortButton
                          onSelect={(v: any) => setSort(v.value)}
                          label={sortLabel}
                          items={sortItems}
                        />
                      </div>
                      <TimeblockablesComponent
                        rootId={params.id || ''}
                        timeblocks={timeblockables}
                        request={timeblockablesRequest}
                      />
                      <div className="mt-4 w-100">
                        <Button onClick={handleFormSubmit} label={i18n.button.saveChanges} isForm />
                      </div>
                    </div>
                  )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default EditTimeline;
