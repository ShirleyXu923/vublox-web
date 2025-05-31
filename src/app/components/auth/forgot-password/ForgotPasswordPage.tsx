import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Container, Row,
} from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { ArrowLeftIcon } from '@shared/icons';

import ChangePassword from './components/ChangePassword';
import ChangePasswordSuccess from './components/ChangePasswordSuccess';
import SendCode from './components/SendCode';
import Verification from './components/Verification';
import './ForgotPasswordPage.scss';

const RESET_STEPS = {
  SEND_CODE: 'SEND_CODE',
  VERIFICATION: 'VERIFICATION',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  CHANGE_PASSWORD_SUCCESS: 'CHANGE_PASSWORD_SUCCESS',
};

function ForgotPasswordPage() {
  const i18nGeneral = useTranslation('general');
  const navigate = useNavigate();

  const [ step, setStep ] = useState(RESET_STEPS.SEND_CODE);

  return (
    <div className="forgot-password">
      <div className="accent left" />
      <div className="accent right" />

      <Container>
        <Row className="justify-content-center">
          <Col md={8} className="my-auto">
            {step === RESET_STEPS.SEND_CODE && (
              <Button size="sm" className="btn-back" onClick={() => navigate(-1)}>
                <ArrowLeftIcon />
                {i18nGeneral.button.back}
              </Button>
            )}
            {(step === RESET_STEPS.VERIFICATION || step === RESET_STEPS.CHANGE_PASSWORD) && (
              <Button
                size="sm"
                className="btn-back"
                onClick={() => setStep(step === RESET_STEPS.VERIFICATION ? RESET_STEPS.SEND_CODE
                  : RESET_STEPS.VERIFICATION)}
              >
                <ArrowLeftIcon />
                {i18nGeneral.button.back}
              </Button>
            )}
            {step === RESET_STEPS.SEND_CODE && (
              <SendCode
                onNext={() => setStep(RESET_STEPS.VERIFICATION)}
              />
            )}
            {step === RESET_STEPS.VERIFICATION && (
              <Verification
                onNext={() => setStep(RESET_STEPS.CHANGE_PASSWORD)}
              />
            )}
            {step === RESET_STEPS.CHANGE_PASSWORD && (
              <ChangePassword
                onNext={() => setStep(RESET_STEPS.CHANGE_PASSWORD_SUCCESS)}
              />
            )}
            {step === RESET_STEPS.CHANGE_PASSWORD_SUCCESS && (
              <ChangePasswordSuccess />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ForgotPasswordPage;
