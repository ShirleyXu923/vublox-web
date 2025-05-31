import './EditOrganization.scss';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { getOrganizationRequest, getTimelineByOrganizationRequest, updateOrganizationRequest } from '@reducers/organization/OrganizationAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { Button as IButton } from '@shared/buttons/Button';
import Timeline from '@shared/components/Timeline';
import { OrganizationForm } from '@shared/forms/organization-form';

function EditOrganization() {
  const i18n = LocaleService.getTranslations('organizations');
  const dispatch = useDispatch<any>();
  const params = useParams();
  const navigate = useNavigate();
  const { timeBlocks } = useSelector((state: IRootState) => state.Organization);
  const [ activeTab, setActiveTab ] = useState('details');
  const [ isLoading, setIsLoading ] = useState(false);
  const [ defaultData, setDefaultData ] = useState();
  const user = useSelector((state: IRootState) => state.Auth.user);
  const account = useSelector((state: IRootState) => state.Auth.account);

  const getOrganizationData = async () => {
    setIsLoading(true);
    const res = await dispatch(getOrganizationRequest(params.id as string)).$promise;
    let organizationData = res.data;

    if (organizationData.created_by !== user?.id && organizationData.created_by !== account?.id) {
      navigate('/errors/404');
    }

    const formattedTags = organizationData?.tags?.map((tag: any) => (
      {
        label: tag,
        value: tag,
      } as any
    ));

    organizationData = {
      ...organizationData,
      default_tags: formattedTags,
      noEndDate: organizationData.ended_at !== null,
      category: {
        label: organizationData?.category?.name,
        value: organizationData?.category?.id,
      },
      privacy: {
        label: (i18n.label as any)?.[organizationData.privacy_option],
        value: organizationData.privacy_option,
      },
    };

    setDefaultData(organizationData);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const saveTimeblocks = () => {
    toast.success(i18n.success.updated);
    navigate(`/organizations/${params.id}`);
  };

  const afterSubmission = () => {
    toast.success(i18n.success.updated);
    setActiveTab('timeline');
  };

  const initialLoad = async () => {
    try {
      setIsLoading(true);
      await dispatch(getTimelineByOrganizationRequest(params.id));
      await getOrganizationData();
    } catch (error) {
      handleError(error, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialLoad();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="main-container">
      <Container className="inner-page-container edit-container">
        <Row className="justify-content-center">
          <Col md={11}>
            <h2 className="page-title text-center">{i18n.label.editOrganization}</h2>

            {/* Tabs */}
            <div className="tab-options">
              {activeTab === 'details'
                ? (
                  <Button
                    className="b6"
                    color="primary"
                    onClick={() => setActiveTab('details')}
                  >
                    {i18n.label.details}
                  </Button>
                )
                : (
                  <div className="b5 tab" onClick={() => setActiveTab('details')}>{i18n.label.details}</div>
                )}
              {activeTab === 'timeline'
                ? (
                  <Button className="b6" color="primary" onClick={() => setActiveTab('timeline')}>{i18n.label.timeline}</Button>
                )
                : (
                  <div className="b5 tab" onClick={() => setActiveTab('timeline')}>{i18n.label.timeline}</div>
                )}
            </div>

            {activeTab === 'details' && (
              <div>
                {!isLoading && (
                  <OrganizationForm
                    submit={{
                      label: i18n.button.saveChanges,
                      request: updateOrganizationRequest,
                      params: [ params.id ],
                      after: afterSubmission,
                    }}
                    defaultValue={defaultData}
                  />
                )}
              </div>
            )}

            {activeTab === 'timeline' && timeBlocks.length > 0 && (
              <div className="timeline">
                <Timeline timeBlocks={timeBlocks} />
                <div className="action">
                  <IButton isForm onClick={saveTimeblocks} label={i18n.button.saveChanges} />
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default EditOrganization;
