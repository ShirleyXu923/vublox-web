import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Col, Container, Row } from 'reactstrap';

import { IRootState } from '@app/store';
import { getTimeblockablesRequest, publishTimelineRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import BackButton from '@shared/buttons/BackButton';
import { Button } from '@shared/buttons/Button';
import SkipButton from '@shared/buttons/SkipButton';
import SortButton from '@shared/buttons/SortButton';
import ConfirmPublishModal from '@shared/components/Modal/ConfirmPublishModal';
import { TimeblockablesComponent } from '@shared/components/TimeblockablesComponent';
import useTranslation from '@shared/hooks/useTranslation';

import { TimelineLoader } from '../../components/timeline-loader';
import './CreateTimeblocks.scss';

function CreateTimeblocks() {
  const i18n = useTranslation('createTimeline');
  const params = useParams();
  const [ searchParams ] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const timeblockables = useSelector((state: IRootState) => state.Timeline.timelineTimeblockables);
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });

  const [ loading, setLoading ] = useState(true);
  const [ showConfirmModal, setShowConfirmModal ] = useState(false);
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

  const timeblockablesRequest = async () => {
    const query = {
      sort,
    };
    await dispatch(getTimeblockablesRequest(params.id || '', query)).$promise;
  };

  const publishTimeline = async () => {
    try {
      await dispatch(publishTimelineRequest(searchParams.get('data_id') || params.id as string));
      toast.success(i18n.success.timelinePublished);
      navigate(`/timelines/${searchParams.get('data_id') || params.id}`);
    } catch (error: any) {
      toast.error(i18n.errors.publishTimeline);
    }
  };

  const loadTimeblockables = async () => {
    try {
      setLoading(true);
      await timeblockablesRequest();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!params.id) {
      navigate('/errors/404');
    }
    loadTimeblockables();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    timeblockablesRequest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ sort ]);

  return (
    <Container className="main-container create_timeblocks__page">
      <Container className="px-0 px-md-5 py-4">
        <Row className="flex justify-content-center">
          <Col md={11}>
            <div className="w-100 mb-4 d-flex justify-content-between align-items-center skip_button__wrapper">
              <BackButton />
              <SkipButton onClick={() => navigate(`/timelines/${params.id}`)} />
            </div>
          </Col>
          <Col md={11}>
            <div className="d-flex justify-content-between mt-4">
              <h2 className={classNames({
                s3: isSmScreen,
              })}
              >
                {i18n.title}
              </h2>
              <SortButton
                onSelect={(v: any) => setSort(v.value)}
                label={sortLabel}
                items={sortItems}
              />
            </div>
          </Col>
          <Col md={11} className="mt-5">
            {loading
              ? (<TimelineLoader />)
              : (
                <TimeblockablesComponent
                  rootId={params.id || ''}
                  timeblocks={timeblockables}
                  request={timeblockablesRequest}
                />
              )}
          </Col>
          <Col md={11}>
            <div className="d-flex gap-3 w-100 mt-4 submit_buttons__wrapper">
              <Button
                onClick={() => navigate(`/timelines/${params.id}`)}
                color="primary"
                outline
                isForm
                label={i18n.button.saveAsDraft}
              />
              <Button
                onClick={() => setShowConfirmModal(true)}
                color="primary"
                isForm
                label={i18n.button.publishTimeline}
              />
            </div>
          </Col>
        </Row>
      </Container>
      <ConfirmPublishModal
        title={i18n.label.confirmPublishModalTitle}
        description={i18n.label.confirmPublishModalDescription}
        confirmButtonText={i18n.button.publishTimeline}
        draftButtonText={i18n.button.confirmPublishModalDraft}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={publishTimeline}
        isOpen={showConfirmModal}
        toggle={() => setShowConfirmModal(!showConfirmModal)}
      />
    </Container>
  );
}

export default CreateTimeblocks;
