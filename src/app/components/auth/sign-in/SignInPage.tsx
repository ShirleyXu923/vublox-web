import classNames from 'classnames';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Alert,
  Button, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Spinner,
} from 'reactstrap';

import {
  loginRequest, externalLoginRequest,
  getUserDetailsRequest,
} from '@reducers/auth/AuthAction';
import AuthService from '@services/AuthService';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';
import {
  AppleIcon,
  EmailIcon, ErrorIcon, FacebookIcon, GoogleIcon,
  PasswordIcon, VisibilityOffIcon, VisibilityOnIcon, XIcon,
} from '@shared/icons';

import './SignInPage.scss';

function SignInPage() {
  const i18n = useTranslation('auth');
  const [ formData, setFormData ] = useState({
    email: '',
    password: '',
  });
  const [ loading, setLoading ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);
  const [ showError, setShowError ] = useState(false);

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setFormData((s) => ({
      ...s,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setShowError(false);
    try {
      await dispatch(loginRequest(formData)).$promise;
      await dispatch(getUserDetailsRequest()).$promise;
      navigate('/world-events');
    } catch (err) {
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLoginError = (err: any) => {
    const { response } = err;
    const { errors: errs } = response?.data || {};
    if (response?.status === 422) {
      const errorMessage = Object.values(errs)[0] as any;
      toast.error(errorMessage[0]);
      return;
    }
    handleError(err);
    setLoading(false);
  };

  const handleSocialLoginRequest = (request: any) => {
    dispatch(externalLoginRequest(request)).$promise
      .then(() => {
        dispatch(getUserDetailsRequest());
        navigate('/world-events');
        setLoading(false);
      })
      .catch((err: any) => {
        handleSocialLoginError(err);
      });
  };

  const loginWithGoogle = () => {
    AuthService.withGoogle().then(({ user, ...rest }: any) => {
      handleSocialLoginRequest({ ...rest, ...user, type: 'google' });
    }).catch(e => handleError(e));
  };

  const loginWithFacebook = () => {
    AuthService.withFacebook().then(({ user, ...rest }: any) => {
      handleSocialLoginRequest({ ...rest, ...user, type: 'fb' });
    }).catch(e => handleError(e));
  };

  const loginWithTwitter = () => {
    AuthService.withTwitter().then(({ user, ...rest }: any) => {
      handleSocialLoginRequest({ ...rest, ...user, type: 'twitter' });
    }).catch(e => handleError(e));
  };

  const loginWithApple = () => {
    AuthService.withApple().then(({ user, ...rest }: any) => {
      handleSocialLoginRequest({ ...rest, ...user, type: 'apple' });
    }).catch(e => handleError(e));
  };

  return (
    <div className="sign-in">

      <h3 className="fw-bold mt-3 mb-5 text-center">{i18n.label.welcomeBack}</h3>

      <Button
        block
        className="btn-social mb-4"
        onClick={loginWithGoogle}
      >
        <GoogleIcon className="me-2" />
        {i18n.button.continueWithGoogle}
      </Button>
      <Button
        block
        className="btn-social mb-4"
        onClick={loginWithFacebook}
      >
        <FacebookIcon className="me-2" />
        {i18n.button.continueWithFacebook}
      </Button>
      <Button
        block
        className="btn-social mb-4"
        onClick={loginWithTwitter}
      >
        <XIcon className="me-2" />
        {i18n.button.continueWithX}
      </Button>
      <Button
        block
        className="btn-social"
        onClick={loginWithApple}
      >
        <AppleIcon className="me-2" />
        {i18n.button.continueWithApple}
      </Button>
      <div className="my-4 text-center text-muted">
        {i18n.label.or}
      </div>

      {/* Login Form */}
      {showError && (
        <div className="text-center">
          <Alert color="danger">
            <ErrorIcon className="me-2" width="20" height="20" />
            {i18n.error.login}
          </Alert>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup noMargin className="mb-4">
          <InputGroup className={classNames({
            'is-invalid': showError,
          })}
          >
            <InputGroupText>
              <EmailIcon />
            </InputGroupText>
            <FormGroup noMargin floating>
              <Input
                name="email"
                type="email"
                placeholder={i18n.placeholder.email}
                onChange={handleInputChange}
                invalid={showError}
              />
              <Label for="email">{i18n.label.email}</Label>
            </FormGroup>
          </InputGroup>
        </FormGroup>

        <FormGroup noMargin className="mb-3">
          <InputGroup className={classNames({
            'is-invalid': showError,
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
                onChange={handleInputChange}
                invalid={showError}
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
        </FormGroup>

        <Button
          size="sm"
          color="link"
          className="p-0 fw-bold"
          onClick={() => navigate('/forgot-password')}
        >
          {i18n.button.forgotPassword}
        </Button>
        <Button
          color="primary"
          block
          className="mt-5"
          disabled={!formData.email || !formData.password}
          type="submit"
        >
          {loading && <Spinner size="sm" className="me-2" />}
          {i18n.button.signIn}
        </Button>
      </Form>
    </div>
  );
}

export default SignInPage;
