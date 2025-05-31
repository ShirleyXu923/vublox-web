import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';

import { createOrganizationRequest } from '@reducers/organization/OrganizationAction';
import LocaleService from '@services/LocaleService';
import './CreateOrganization.scss';
import { OrganizationForm } from '@shared/forms/organization-form';

function CreateOrganization() {
  const i18n = LocaleService.getTranslations('createOrganization');
  const navigate = useNavigate();

  const afterSubmission = (data: any) => {
    toast.success(i18n.success.organizationCreated);
    navigate(`/organizations/${data?.id}/timelines`);
  };

  return (
    <Container className="main-container">
      <Container className="create-organization">
        <Row className="justify-content-center">
          <Col md={11}>
            <h2 className="text-center page-title">{i18n.label.title}</h2>

            <OrganizationForm
              submit={{
                request: createOrganizationRequest,
                params: [],
                after: afterSubmission,
              }}
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default CreateOrganization;
