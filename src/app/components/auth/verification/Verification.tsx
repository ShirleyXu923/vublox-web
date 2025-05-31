/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button, Col, Container, Row,
} from 'reactstrap';

import verified from '@assets/img/verification.png';
import { resendVerificationRequest, verifyEmailRequest } from '@reducers/auth/AuthAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import useTranslation from '@shared/hooks/useTranslation';

import './Verification.scss';

function Verification() {
  const i18n = useTranslation('verification');
  const { token } = useParams();
  const [ loading, setLoading ] = useState(true);
  const [ email, setEmail ] = useState('');
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const loadData = () => {
    dispatch(verifyEmailRequest({
      token,
    })).$promise
      .then(() => {
        setLoading(false);
      })
      .catch((err: AxiosError) => {
        const { response } = err;
        const e = (response?.data as any).email;
        setEmail(e);

        if (!e) {
          return;
        }

        setLoading(false);
      });
  };

  const resend = () => {
    dispatch(resendVerificationRequest({
      token,
    })).$promise
      .then(() => {
        toast.success(i18n.label.verificationLinkSent);
        navigate('/home');
      }).catch((err: any) => {
        handleError(err);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return loading ? null : (
    <div className="verification p-5">
      <div className="accent left" />
      <div className="accent right" />

      <Container className="h-100 p-0">
        <Row className="justify-content-center h-100 p-0">
          <Col md={6} className="my-auto text-center">
            {email ? (
              <>
                <h2 className="mb-4">
                  {i18n.label.verificationLinkExpired}
                </h2>

                <p className="text-center">
                  {i18n.label.verificationLinkExpiredDescription}
                </p>

                <Button
                  color="primary"
                  className="mt-5"
                  onClick={resend}
                  block
                >
                  {i18n.button.resendVerificationLink}
                </Button>
              </>
            ) : (
              <>
                <img className="mb-2" src={verified} width="150" alt="Success" />
                <h2 className="my-4">
                  {i18n.label.verified}
                </h2>

                <p className="text-center">
                  {LocaleService.parseTranslation(i18n.label.verifiedDescription, {
                    companyName: 'Vublox',
                  })}
                </p>

                <Button
                  color="primary"
                  className="mt-5"
                  onClick={() => navigate('/home', { replace: true })}
                  block
                >
                  {i18n.button.goToHome}
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Verification;
