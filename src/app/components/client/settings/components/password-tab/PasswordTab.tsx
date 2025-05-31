import React, {
  ChangeEvent, FormEvent, useEffect, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Form, Spinner } from 'reactstrap';

import { IRootState } from '@app/store';
import { changeNewPasswordRequest } from '@reducers/auth/AuthAction';
import useTranslation from '@shared/hooks/useTranslation';
import { PasswordIcon } from '@shared/icons';
import PasswordInput from '@shared/utils/Forms/PasswordInput/PasswordInput';
import PasswordStrengthFeedback from '@shared/utils/PasswordStrengthFeedback/PasswordStrengthFeedback';

import './PasswordTab.scss';

function PasswordTab() {
  const i18n = useTranslation('settings.password');
  const dispatch = useDispatch<any>();
  const user: any = useSelector((state: IRootState) => state.Auth.user);
  const [ data, setData ] = useState({
    old_password: '',
    password: '',
    password_confirm: '',
    external_id: user.external_id,
  });
  const [ isLoading, setIsLoading ] = useState(false);
  const [ errors, setErrors ] = useState<any>({});

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setData((s) => ({
      ...s,
      [target.name]: target.value,
    }));
  };

  const validatePassword = () => {
    if (data.password !== data.password_confirm) {
      setErrors({
        password_confirm: [ i18n.label.passwordsNotMatch ],
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (!validatePassword()) return;
      const { data: u } = await dispatch(changeNewPasswordRequest(data)).$promise;
      toast.success(i18n.success.changePassword);
      setData({
        old_password: '',
        password: '',
        password_confirm: '',
        external_id: u.external_id,
      });
    } catch (err: any) {
      const { response = {} } = err;
      const { errors: errs } = response?.data as any;
      if (response?.status === 422) {
        setErrors(errs);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setData(s => ({
      ...s,
      external_id: user.external_id,
    }));
  }, [ user.external_id ]);

  return (
    <div className="password-tab pt-4">
      <Form onSubmit={handleSubmit}>
        {!user.external_id && (
          <PasswordInput
            name="old_password"
            label={i18n.label.current}
            placeholder={i18n.label.current}
            leftIcon={(<PasswordIcon />)}
            onChange={handleInputChange}
            errors={errors.old_password}
            formGroupProps={{ className: 'mb-4' }}
            value={data.old_password}
          />
        )}
        <PasswordInput
          name="password"
          label={i18n.label.password}
          placeholder={i18n.label.password}
          leftIcon={(<PasswordIcon />)}
          onChange={handleInputChange}
          errors={errors.password}
          formGroupProps={{ className: 'mb-4' }}
          value={data.password}
        />
        {data.password && (
          <div className="mb-3">
            <PasswordStrengthFeedback
              password={data.password}
            />
          </div>
        )}
        <PasswordInput
          name="password_confirm"
          label={i18n.label.confirmPassword}
          placeholder={i18n.label.confirmPassword}
          leftIcon={(<PasswordIcon />)}
          onChange={handleInputChange}
          formGroupProps={{ className: 'mb-4' }}
          errors={errors.password_confirm}
          value={data.password_confirm}
        />
        <Button
          color="primary"
          block
          type="submit"
          className="mt-4 action-button"
          disabled={(!user.external_id && !data.old_password)
             || !data.password || !data.password_confirm || isLoading}
        >
          {isLoading && <Spinner size="sm" className="me-2" />}
          {i18n.button.saveChanges}
        </Button>
      </Form>
    </div>
  );
}

export default PasswordTab;
