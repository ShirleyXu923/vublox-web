import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Button, Col, Container, Row,
} from 'reactstrap';

import LocaleService from '@services/LocaleService';
import useTranslation from '@shared/hooks/useTranslation';
import { ArrowLeftIcon } from '@shared/icons';
import './SignUpSuccessPage.scss';

function SignUpSuccessPage() {
  const i18n = useTranslation('verification');
  const i18nGeneral = useTranslation('general');
  const location = useLocation();
  const { email } = location.state || {};

  const navigate = useNavigate();

  const signup = () => {
    navigate('/auth');
  };

  return !email ? <Navigate to="/auth" /> : (
    <div className="sign-up-success">
      <div className="accent left" />
      <div className="accent right" />

      <Container className="h-100 p-0">
        <Row className="justify-content-center h-100 p-0">
          <Col md={6} className="my-auto">
            <Button size="sm" className="btn-back" onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
              {i18nGeneral.button.back}
            </Button>
            <h3 className="fw-bold text-center">{i18n.label.verifyYourAccount}</h3>

            <p className="text-center my-4">
              {LocaleService.parseTranslation(i18n.label.verifyDescription, {
                email: (
                  <b>{email}</b>
                ),
                link: (
                  <Button color="link" className="mb-1 p-0 shadow-none" onClick={signup}>
                    {i18n.label.clickHere}
                  </Button>
                ),
              })}
            </p>
            <p className="text-center my-4">{i18n.label.verifyDescription2}</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignUpSuccessPage;
