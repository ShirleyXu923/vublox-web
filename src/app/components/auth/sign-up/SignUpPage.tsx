import classNames from 'classnames';
import _ from 'lodash';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Col, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupText,
  Label, Row, Spinner,
} from 'reactstrap';

import { registerRequest } from '@reducers/auth/AuthAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import useTranslation from '@shared/hooks/useTranslation';
import {
  CheckCircleFillIcon,
  CheckCircleIcon, EmailIcon, ErrorIcon, InfoIcon, PasswordIcon,
  UserIcon, VisibilityOffIcon, VisibilityOnIcon,
} from '@shared/icons';
import UsernameIcon from '@shared/icons/UsernameIcon';
import DatePickerInput from '@shared/utils/Forms/DatePickerInput/DatePickerInput';
import PasswordStrengthFeedback from '@shared/utils/PasswordStrengthFeedback/PasswordStrengthFeedback';

import './SignUpPage.scss';

function SignUpPage() {
  const i18n = useTranslation('auth');
  const navigate = useNavigate();
  const [ formData, setFormData ] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
    username: '',
    birth_date: null as Date | null, // Initialize with null and specify the type
  });
  const [ errors, setErrors ] = useState<any>({});
  const [ loading, setLoading ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);
  const [ showPasswordConfirm, setShowPasswordConfirm ] = useState(false);

  const dispatch = useDispatch<any>();

  const validatePassword = () => formData.password.length >= 8;
  const validatePasswordConfirm = () => !!formData.password
    && formData.password === formData.password_confirm;

  const isPasswordValid = validatePassword();
  const isPasswordConfirmValid = validatePasswordConfirm();

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setFormData((s) => ({
      ...s,
      [target.name]: target.value,
    }));
  };
  // eslint-disable-next-line camelcase
  const handleDateChange = (birth_date : Date | null) => {
    setFormData({ ...formData, birth_date });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await dispatch(registerRequest(formData)).$promise;
      navigate('/sign-up/success', { state: { email: formData.email } });
    } catch (error: any) {
      const { response } = error;
      const { errors: errs } = response?.data || {};
      if (response?.status === 422) {
        setErrors(errs);
        return;
      }

      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  const validateUsername = () => {
    const { username } = formData;
    const minLength = 3;
    const maxLength = 30;
    const noSpecialChars = /^[a-zA-Z0-9_.]+$/; // Alphanumeric characters, underscore, and period only

    return (
      username.length >= minLength
    && username.length <= maxLength
    && noSpecialChars.test(username)
    );
  };

  const isUsernameValid = validateUsername();
  return (
    <div className="sign-up">
      <h3 className="fw-bold mt-3 mb-5 text-center">{i18n.label.signUpForFree}</h3>
      <Alert
        color="highlight"
        role="alert"
      >
        <div className="d-flex gap-2 mb-1">
          <InfoIcon fill="var(--bs-primary)" height={20} width={20} className="flex-shrink-0" />
          <div className="b5 text-dark lh-sm">{i18n.label.contentMessage}</div>
        </div>
      </Alert>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Col md={6} className="mb-4 mb-md-0">
            <InputGroup>
              <InputGroupText>
                <UserIcon />
              </InputGroupText>
              <FormGroup noMargin floating>
                <Input
                  name="first_name"
                  placeholder={i18n.placeholder.firstName}
                  onChange={handleInputChange}
                />
                <Label for="first_name">{i18n.label.firstName}<span className="text-danger">*</span></Label>
              </FormGroup>
            </InputGroup>
          </Col>
          <Col sm={6}>
            <InputGroup>
              <InputGroupText>
                <UserIcon />
              </InputGroupText>
              <FormGroup noMargin floating>
                <Input
                  name="last_name"
                  placeholder={i18n.placeholder.lastName}
                  onChange={handleInputChange}
                />
                <Label for="last_name">{i18n.label.lastName}<span className="text-danger">*</span></Label>
              </FormGroup>
            </InputGroup>
          </Col>
        </Row>

        <FormGroup noMargin className="mb-4">
          <InputGroup className={classNames({
            'is-invalid': errors.email,
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
                invalid={errors.email}
              />
              <Label for="email">{i18n.label.email}<span className="text-danger">*</span></Label>
            </FormGroup>
          </InputGroup>
          <FormFeedback>
            {errors.email && errors.email[0]}
          </FormFeedback>
        </FormGroup>

        <FormGroup noMargin className="mb-4">
          <InputGroup
            className={classNames({
              'is-valid': isUsernameValid && _.isEmpty(errors.username),
              'is-invalid': !!errors.username,
            })}
          >
            <InputGroupText>
              <UsernameIcon />
            </InputGroupText>
            <FormGroup noMargin floating>
              <Input
                name="username"
                type="text"
                placeholder={i18n.placeholder.username}
                onChange={(e) => {
                  handleInputChange(e); // Your existing handler
                  // Clear the error when typing
                  if (errors.username) {
                    setErrors((prev: any) => ({ ...prev, username: '' }));
                  }
                }}
                valid={isUsernameValid && _.isEmpty(errors.username)}
                invalid={!!errors.username}
                required
                maxLength={30}
              />
              <Label
                for="username"
                className={classNames({
                  'text-success': isUsernameValid && _.isEmpty(errors.username), // Green when valid
                  'text-danger': !!errors.username, // Red when invalid
                })}
              >
                {i18n.label.username}
                <span className="text-danger">*</span>
              </Label>
            </FormGroup>
          </InputGroup>

          {!!formData.username && (
            <small
              className={classNames('ms-3 mt-1', {
                'valid-feedback': isUsernameValid && _.isEmpty(errors.username),
                'invalid-feedback': !!errors.username,
                'd-block': !errors.username, // Show helper feedback if no error
                'd-none': !!errors.username, // Hide helper feedback if there's an error
              })}
            >
              {isUsernameValid && _.isEmpty(errors.username) ? (
                <>
                  <CheckCircleFillIcon />
                  <span className="ms-1">{i18n.label.usernameValidation}</span>
                </>
              ) : (
                <>
                  <ErrorIcon />
                  <span className="ms-1 text-danger">{i18n.label.usernameValidation}</span>
                </>
              )}
            </small>
          )}

          {!!errors.username && (
            <FormFeedback className="d-block">{errors.username}</FormFeedback>
          )}
        </FormGroup>

        <FormGroup noMargin className="mb-2">
          <DatePickerInput
            label={i18n.placeholder.birthday}
            selected={formData.birth_date}
            onChange={handleDateChange}
            required
            errors={errors.birth_date}
            leftIconPosition
            maxDate={new Date()}
            placeholderText={i18n.placeholder.monthDayYear}
          />
        </FormGroup>

        <FormGroup noMargin className="mb-4">
          <InputGroup className={classNames({
            'is-valid': isPasswordValid && _.isEmpty(errors.password),
            'is-invalid': formData.password && !(isPasswordValid && _.isEmpty(errors.password)),
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
                valid={(isPasswordValid && _.isEmpty(errors.password))}
                className={formData.password && !(isPasswordValid && _.isEmpty(errors.password)) ? 'border-danger' : ''}
              />
              <Label for="password">{i18n.label.password}<span className="text-danger">*</span></Label>
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

          {!!formData.password && (
            <small className={classNames({
              'ms-3 mt-1': true,
              'valid-feedback': isPasswordValid && _.isEmpty(errors.password),
            })}
            >
              {(isPasswordValid && _.isEmpty(errors.password)) ? (
                <CheckCircleFillIcon />
              ) : (
                <CheckCircleIcon />
              )}
              <small className="ms-1">
                {_.isEmpty(errors.password) ? i18n.label.passwordValidation : errors.password[0]}
              </small>
            </small>
          )}
        </FormGroup>

        {!!formData.password && (
          <div className="my-4">
            <PasswordStrengthFeedback
              password={formData.password}
            />
          </div>
        )}

        <FormGroup noMargin className="mb-4">
          <InputGroup className={classNames({
            'is-valid': isPasswordConfirmValid,
            'is-invalid': formData.password && !isPasswordConfirmValid,
          })}
          >
            <InputGroupText>
              <PasswordIcon />
            </InputGroupText>
            <FormGroup noMargin floating>
              <Input
                name="password_confirm"
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="Password"
                onChange={handleInputChange}
                valid={isPasswordConfirmValid}
                invalid={!!formData.password && !isPasswordConfirmValid}
              />
              <Label for="password_confirm">{i18n.label.confirmPassword}<span className="text-danger">*</span></Label>
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

          {!!formData.password && (
            <small className={classNames({
              'ms-3 mt-1': true,
              'valid-feedback': isPasswordConfirmValid,
              'invalid-feedback': formData.password && !isPasswordConfirmValid,
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
          className="mt-5"
          disabled={!formData.first_name || !formData.last_name || !formData.email
            || !formData.birth_date || !isUsernameValid || !isPasswordValid
            || !isPasswordConfirmValid}
          type="submit"
        >
          {loading && <Spinner size="sm" className="me-2" />}
          {i18n.button.createAccount}
        </Button>
      </Form>

      <p className="text-center mt-3">
        <small>
          {LocaleService.parseTranslation(i18n.label.createAccountTerms, {
            termsAndConditions: (
              <a href="#" className="fw-bold">
                <br />
                {i18n.label.termsAndConditions}
              </a>
            ),
            privacyPolicy: (
              <a href="#" className="fw-bold">
                {i18n.label.privacyPolicy}
              </a>
            ),
          })}
        </small>
      </p>
    </div>
  );
}

export default SignUpPage;
