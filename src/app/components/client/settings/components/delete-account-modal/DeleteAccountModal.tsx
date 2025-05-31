import React, { FormEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button, Form, Modal, ModalBody, ModalHeader,
  Spinner,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { deleteAccountRequest, sendVerificationCodeRequest } from '@reducers/auth/AuthAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import useTranslation from '@shared/hooks/useTranslation';
import Input from '@shared/utils/Forms/Input/Input';
import PasswordInput from '@shared/utils/Forms/PasswordInput/PasswordInput';

function DeleteAccountModal({ show, toggle }: {
  show: boolean;
  toggle: () => void
}) {
  const i18n = useTranslation('settings.account');
  const user: any = useSelector((state: IRootState) => state.Auth.user);
  const [ password, setPassword ] = useState('');
  const [ verificationCode, setVerificationCode ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ errors, setErrors ] = useState<any>({});
  const [ step, setStep ] = useState(user.external_id ? 1 : 2);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(deleteAccountRequest({
        password,
        verification_code: verificationCode,
        external_id: user.external_id,
      })).$promise;
      toast.success(i18n.success.delete);
      navigate('/');
    } catch (err: any) {
      const { response = {} } = err;
      const { errors: errs } = response?.data as any;
      if (response?.status === 422) {
        setErrors(errs);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendVerification = async () => {
    try {
      await dispatch(sendVerificationCodeRequest({
        email_or_mobile: user.email,
        type: 'delete-account',
      }));
      setStep(2);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    if (!show) {
      setPassword('');
      setVerificationCode('');
      setStep(user.external_id ? 1 : 2);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ show ]);

  return (
    <Modal
      isOpen={show}
      toggle={toggle}
      centered
      className="account-modal"
      unmountOnClose
    >
      <ModalHeader toggle={toggle}>
        <h3>{i18n.label.deleteAccount}</h3>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="description mb-3">
                {LocaleService.parseTranslation(i18n.label.deleteDescription1,
                  { email: user.email })}
              </div>
              <Button
                type="button"
                color="danger"
                block
                className="mt-4"
                onClick={() => sendVerification()}
              >
                {i18n.button.sendVerificationCode}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="description mb-3">
                {user.external_id ? LocaleService.parseTranslation(i18n.label.deleteDescription2,
                  { email: user.email }) : i18n.label.deleteDescription}
              </div>
              {user.external_id ? (
                <Input
                  label={i18n.label.verificationCode}
                  placeholder={i18n.label.verificationCode}
                  onChange={({ target: { value } }) => setVerificationCode(value)}
                  errors={errors.verification_code}
                />
              ) : (
                <PasswordInput
                  label={i18n.label.password}
                  placeholder={i18n.label.password}
                  onChange={({ target: { value } }) => setPassword(value)}
                  errors={errors.password}
                />
              )}
              <Button
                type="submit"
                color="danger"
                block
                className="mt-4"
                disabled={(user.external_id ? !verificationCode : !password) || loading}
              >
                {loading && <Spinner size="sm" className="me-2" />}
                {i18n.button.deleteAccount}
              </Button>
            </>
          )}

        </Form>
      </ModalBody>
    </Modal>
  );
}

export default DeleteAccountModal;
