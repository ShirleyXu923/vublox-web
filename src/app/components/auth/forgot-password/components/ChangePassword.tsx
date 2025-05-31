import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Button, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupText, Label,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { changePasswordRequest } from '@reducers/auth/AuthAction';
import useTranslation from '@shared/hooks/useTranslation';
import {
  CheckCircleFillIcon, CheckCircleIcon, ErrorIcon,
  PasswordIcon, VisibilityOffIcon, VisibilityOnIcon,
} from '@shared/icons';
import PasswordStrengthFeedback from '@shared/utils/PasswordStrengthFeedback/PasswordStrengthFeedback';

interface IChangePassword {
  onNext: () => void;
}

function ChangePassword({ onNext }: IChangePassword) {
  const i18n = useTranslation('forgotPassword');
  const forgotPassword = useSelector((state: IRootState) => state.Auth.forgotPassword);

  const [ showPassword, setShowPassword ] = useState(false);
  const [ showPasswordConfirm, setShowPasswordConfirm ] = useState(false);
  const [ password, setPassword ] = useState('');
  const [ passwordConfirmation, setPasswordConfirmation ] = useState('');
  const [ errors, setErrors ] = useState({} as any);

  const validatePassword = () => password.length >= 8;
  const validatePasswordConfirm = () => !!password
    && password === passwordConfirmation;

  const isPasswordValid = validatePassword();
  const isPasswordConfirmValid = validatePasswordConfirm();

  const dispatch = useDispatch<any>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(changePasswordRequest({
        id: forgotPassword.account_reset_id,
        email_or_mobile: forgotPassword.email_or_mobile,
        verification_code: forgotPassword.verification_code,
        password,
      })).$promise;
      onNext();
      toast.success(i18n.success.resetPassword);
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
      <h2 className="fw-bold text-center my-5">{i18n.label.changePassword}</h2>

      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-4">
          <InputGroup className={classNames({
            'is-valid': isPasswordValid,
          })}
          >
            <InputGroupText>
              <PasswordIcon width="18" height="18" />
            </InputGroupText>
            <FormGroup noMargin floating>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={i18n.placeholder.password}
                onChange={({ target }) => setPassword(target.value)}
                valid={isPasswordValid}
              />
              <Label for="password">{i18n.label.password}</Label>
            </FormGroup>
            <InputGroupText>
              <Button
                color="link"
                size="sm"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? (
                  <VisibilityOnIcon />
                ) : (
                  <VisibilityOffIcon />
                )}
              </Button>
            </InputGroupText>
          </InputGroup>

          {!!password && (
            <small className={classNames({
              'ms-3 mt-1': true,
              'valid-feedback': isPasswordValid,
            })}
            >
              {isPasswordValid ? (
                <CheckCircleFillIcon />
              ) : (
                <CheckCircleIcon />
              )}
              <small className="ms-1">
                {i18n.label.passwordValidation}
              </small>
            </small>
          )}
          <FormFeedback>
            {errors.password && errors.password[0]}
          </FormFeedback>
        </FormGroup>

        {!!password && (
          <div className="my-4">
            <PasswordStrengthFeedback
              password={password}
            />
          </div>
        )}

        <FormGroup noMargin className="mb-4">
          <InputGroup className={classNames({
            'is-valid': isPasswordConfirmValid,
            'is-invalid': password && !isPasswordConfirmValid,
          })}
          >
            <InputGroupText>
              <PasswordIcon />
            </InputGroupText>
            <FormGroup noMargin floating>
              <Input
                name="password_confirm"
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder={i18n.placeholder.password}
                onChange={({ target }) => setPasswordConfirmation(target.value)}
                valid={isPasswordConfirmValid}
                invalid={!!password && !isPasswordConfirmValid}
              />
              <Label for="password_confirm">{i18n.label.confirmPassword}</Label>
            </FormGroup>
            <InputGroupText>
              <Button
                color="link"
                size="sm"
                onClick={() => setShowPasswordConfirm((s) => !s)}
              >
                {showPasswordConfirm ? (
                  <VisibilityOnIcon />
                ) : (
                  <VisibilityOffIcon />
                )}
              </Button>
            </InputGroupText>
          </InputGroup>
          {!!password && (
            <small className={classNames({
              'ms-3 mt-1': true,
              'valid-feedback': isPasswordConfirmValid,
              'invalid-feedback': password && !isPasswordConfirmValid,
            })}
            >
              {isPasswordConfirmValid ? (
                <CheckCircleFillIcon />
              ) : (
                <ErrorIcon />
              )}
              <small className="ms-1">
                {isPasswordConfirmValid ? i18n.label.confirmPasswordValidation
                  : i18n.label.passwordsNotMatch}
              </small>
            </small>
          )}
        </FormGroup>

        <Button
          color="primary"
          block
          className="mt-5 btn-continue"
          disabled={!password || !passwordConfirmation || password !== passwordConfirmation}
          type="submit"
        >
          {i18n.button.changePassword}
        </Button>
      </Form>
    </div>
  );
}

export default ChangePassword;
