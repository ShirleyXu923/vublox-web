import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, FormFeedback, FormGroup, Input, Label,
} from 'reactstrap';

import { sendVerificationCodeRequest } from '@reducers/auth/AuthAction';
import LocaleService from '@services/LocaleService';
import useTranslation from '@shared/hooks/useTranslation';

interface ISendCode {
  onNext: () => void;
}

function SendCode({ onNext }: ISendCode) {
  const i18n = useTranslation('forgotPassword');
  const [ email, setEmail ] = useState('');
  const [ errors, setErrors ] = useState({} as any);

  const dispatch = useDispatch<any>();

  const handleSubmit = async () => {
    try {
      await dispatch(sendVerificationCodeRequest({ email_or_mobile: email, type: 'reset-password' })).$promise;
      onNext();
    } catch (err: any) {
      const { response } = err;
      const { errors: errs } = response?.data as any;
      if (response?.status === 422) {
        setErrors(errs);
      }
    }
  };

  return (
    <div>
      <h2 className="fw-bold text-center mt-5">{i18n.label.forgotPassword}</h2>

      <div className="my-4 small description text-muted">
        {LocaleService.parseTranslation(i18n.label.forgotPasswordDescription, {
          companyName: 'Vublox',
        })}
      </div>

      <FormGroup floating>
        <Input
          name="email"
          placeholder={i18n.placeholder.email}
          onChange={({ target }) => setEmail(target.value)}
          invalid={errors.email}
        />
        <Label for="email">{i18n.placeholder.email}</Label>
        <FormFeedback>
          {errors.email && errors.email[0]}
        </FormFeedback>
      </FormGroup>

      <Button
        color="primary"
        block
        className="mt-5 btn-continue"
        disabled={!email}
        onClick={handleSubmit}
      >
        {i18n.button.continue}
      </Button>
    </div>
  );
}

export default SendCode;
