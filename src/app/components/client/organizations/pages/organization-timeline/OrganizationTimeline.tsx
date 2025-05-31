import './OrganizationTimeline.scss';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Col, Container, Row,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { getOrganizationRequest, getTimelineByOrganizationRequest, publishOrganizationRequest } from '@reducers/organization/OrganizationAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import BackButton from '@shared/buttons/BackButton';
import SkipButton from '@shared/buttons/SkipButton';
import SortButton from '@shared/buttons/SortButton';
import ConfirmPublishModal from '@shared/components/Modal/ConfirmPublishModal';
import Timeline from '@shared/components/Timeline';
import Info from '@shared/icons/info';
import Alert from '@shared/utils/Alert/Alert';

function OrganizationTimeline() {
  const i18n = LocaleService.getTranslations('createOrganization');
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const params = useParams();
  const timeBlocks = useSelector((state: IRootState) => state.Organization.timeBlocks);
  const [ showPublishModal, setShowPublishModal ] = useState(false);
  const [ selectedSort, setSelectedSort ] = useState('DESC');
  const user = useSelector((state: IRootState) => state.Auth.user);
  const account = useSelector((state: IRootState) => state.Auth.account);
  const [ sortItems ] = useState([
    {
      label: i18n.label.latestToOldest,
      value: 'DESC',
    },
    {
      label: i18n.label.oldestToLatest,
      value: 'ASC',
    },
  ]);

  const handlePublishTimeline = () => {
    dispatch(publishOrganizationRequest(params.id))
      .$promise.then(() => {
        setShowPublishModal(false);
        toast.success(i18n.success.organizationPublished);
        navigate(`/organizations/${params.id}`);
      });
  };

  const updateSelectedSort = (item: any) => {
    setSelectedSort(item?.value);
  };

  const loadOrganization = async () => {
    try {
      const { data } = await dispatch(getOrganizationRequest(params.id || '')).$promise;

      if (user.id !== data.created_by && account.id !== data.created_by) {
        navigate('/errors/404');
      }
    } catch (error) {
      handleError(error, navigate);
    }
  };

  const fetchOrganizationTimelines = async () => {
    try {
      const query = {
        sort: selectedSort,
      };

      await dispatch(getTimelineByOrganizationRequest(params.id || '', query));
    } catch (error: any) {
      handleError(error, navigate);
    }
  };

  useEffect(() => {
    fetchOrganizationTimelines();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ selectedSort ]);

  useEffect(() => {
    const onMount = async () => {
      await loadOrganization();
      await fetchOrganizationTimelines();
    };

    onMount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="main-container">
      <Container className="organization-timeline">
        <Row className="justify-content-center">
          <Col md={11} className="inner-container">
            <div className="skip-button">
              <BackButton />

              <SkipButton onClick={() => navigate('/')} />
            </div>
            <div className="page-title">
              <h2 style={{ marginBottom: '0' }}>{i18n.label.organizationTimeline}</h2>
              <SortButton
                onSelect={updateSelectedSort}
                label={i18n.label.latestToOldest}
                items={sortItems}
              />
            </div>
          </Col>
          <Col md={11} className="inner-container">
            <div className="alert-container">
              <Alert
                hasMaxWidth
                label={i18n.label.organizationTimelineAlert}
                icon={<Info />}
              />
            </div>
          </Col>
          <Col md={11} className="inner-container">
            {timeBlocks.length > 0 && <Timeline timeBlocks={timeBlocks} />}
          </Col>
          <Col md={11} className="action_button__container">
            <div className="action-button">
              <Button onClick={() => navigate('/')} outline color="primary">{i18n.button.saveAsDraft}</Button>
              <Button
                onClick={() => setShowPublishModal(!showPublishModal)}
                color="primary"
              >
                {i18n.button.publishTimeline}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <ConfirmPublishModal
        title={i18n.label.publishOrganizationTimeline}
        description={i18n.label.publishTimelineModalDescription}
        confirmButtonText="Publish"
        draftButtonText={i18n.button.keepEditing}
        onClose={() => setShowPublishModal(false)}
        onConfirm={handlePublishTimeline}
        isOpen={showPublishModal}
        style={{ maxWidth: '637px' }}
        toggle={() => setShowPublishModal(!showPublishModal)}
      />
    </Container>
  );
}

export default OrganizationTimeline;
