import { startCase } from 'lodash';
import React, { FormEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Button, Form, Modal, ModalBody, ModalHeader,
  Spinner,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { changeNewPasswordRequest } from '@reducers/auth/AuthAction';
import LocaleService from '@services/LocaleService';
import useTranslation from '@shared/hooks/useTranslation';
import PasswordInput from '@shared/utils/Forms/PasswordInput/PasswordInput';
import PasswordStrengthFeedback from '@shared/utils/PasswordStrengthFeedback/PasswordStrengthFeedback';

function DisconnectEmailModal({ show, toggle }: {
  show: boolean;
  toggle: () => void
}) {
  const i18n = useTranslation('settings.account');
  const user: any = useSelector((state: IRootState) => state.Auth.user);
  const [ password, setPassword ] = useState('');
  const [ passwordConfirm, setPasswordConfirm ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ errors, setErrors ] = useState<any>({});
  const dispatch = useDispatch<any>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(changeNewPasswordRequest({
        password,
        external_id: user.external_id,
      })).$promise;
      toast.success(i18n.success.disconnect);
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

  useEffect(() => {
    if (!show) {
      setPassword('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      isOpen={show}
      toggle={toggle}
      centered
      className="account-modal"
      unmountOnClose
    >
      <ModalHeader toggle={toggle}>
        <h3>{i18n.label.disconnectEmail}</h3>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <div className="description mb-3">
            {LocaleService.parseTranslation(i18n.label.disconnectDescription,
              { social: startCase(user.external_type) })}
          </div>
          <PasswordInput
            label={i18n.label.newPassword}
            placeholder={i18n.label.newPassword}
            onChange={({ target: { value } }) => setPassword(value)}
            errors={errors.password}
          />
          {password && (
            <PasswordStrengthFeedback
              password={password}
            />
          )}

          <PasswordInput
            label={i18n.label.confirmPassword}
            placeholder={i18n.label.confirmPassword}
            onChange={({ target: { value } }) => setPasswordConfirm(value)}
          />

          <Button
            type="submit"
            color="danger"
            block
            className="mt-4"
            disabled={!password || !passwordConfirm || password !== passwordConfirm}
          >
            {loading && <Spinner size="sm" className="me-2" />}
            {i18n.button.proceed}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default DisconnectEmailModal;
