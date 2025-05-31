/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTimer } from 'react-timer-hook';
import ReactCodeInput from 'react-verification-code-input';
import { Button } from 'reactstrap';

import { IRootState } from '@app/store';
import { sendVerificationCodeRequest, verifyCodeRequest } from '@reducers/auth/AuthAction';
import LocaleService from '@services/LocaleService';
import useTranslation from '@shared/hooks/useTranslation';

interface IVerification {
  onNext: () => void;
}

function Verification({ onNext }: IVerification) {
  const i18n = useTranslation('forgotPassword');
  const [ code, setCode ] = useState('');
  const timestamp = useSelector((state: IRootState) => state.Auth.forgotPassword.timestamp);
  const email = useSelector((state: IRootState) => state.Auth.forgotPassword.email_or_mobile);
  const codeValidityInSeconds = useSelector((state: IRootState) => state.Auth
    .codeValidityInSeconds);
  const [ hasErrors, setHasErrors ] = useState(false);
  const [ resending, setResending ] = useState(false);

  const dispatch = useDispatch<any>();

  const {
    seconds, minutes, isRunning, restart,
  } = useTimer({
    expiryTimestamp: moment(timestamp).add(codeValidityInSeconds, 'seconds').toDate(),
    autoStart: true,
  });

  const formatCountdown = () => `${_.padStart(String(minutes), 2, '0')}:${_.padStart(String(seconds), 2, '0')}`;

  const handleSubmit = async () => {
    setHasErrors(false);
    try {
      await dispatch(verifyCodeRequest({
        email_or_mobile: email,
        verification_code: code.toUpperCase(),
        type: 'reset-password',
      })).$promise;
      onNext();
    } catch (err) {
      setHasErrors(true);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const result = await dispatch(sendVerificationCodeRequest({
        email_or_mobile: email,
        type: 'reset-password',
      })).$promise;
      const { data } = result;
      restart(moment().add(data.codeValidityInSeconds, 'seconds').toDate());
      setResending(false);
    } catch (error) {
      setResending(false);
    }
  };

  const formatEmail = () => email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, '$1***@$2');

  return (
    <div>
      <h2 className="fw-bold text-center mt-5">{i18n.label.verification}</h2>

      <div className="my-4 small description text-muted">
        {LocaleService.parseTranslation(i18n.label.verificationDescription, {
          email: formatEmail(),
        })}
      </div>

      <ReactCodeInput
        type="text"
        className={classNames({
          'code-input mx-auto': true,
          'has-errors': hasErrors,
        })}
        onComplete={setCode}
      />
      {hasErrors && (
        <div className="verification-error">
          {i18n.label.incorrectCode}
        </div>
      )}

      <Button
        color="primary"
        block
        className="mt-5 btn-continue"
        disabled={!code}
        onClick={handleSubmit}
      >
        {i18n.button.continue}
      </Button>

      <div className="mt-2 d-flex align-items-center">
        {i18n.label.didNotReceiveCode}
        {isRunning ? (
          <div className="ms-1 fw-bold text-primary">
            {LocaleService.parseTranslation(i18n.button.resendCodeInTime, {
              time: formatCountdown(),
            })}
          </div>
        ) : (
          <Button
            color="link"
            className="p-0 ms-1 fw-bold"
            onClick={handleResend}
            disabled={resending}
          >
            {i18n.button.resendCode}
          </Button>
        )}
      </div>
    </div>
  );
}

export default Verification;
