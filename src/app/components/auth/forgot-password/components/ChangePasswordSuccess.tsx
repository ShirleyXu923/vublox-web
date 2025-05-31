import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
} from 'reactstrap';

import AuthSuccess from '@assets/img/auth-success.svg';
import useTranslation from '@shared/hooks/useTranslation';

function ChangePasswordSuccess() {
  const i18n = useTranslation('forgotPassword');
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <img src={AuthSuccess} alt="Success" className="mx-auto" />

      <h2 className="fw-bold mt-4">{i18n.label.passwordChanged}</h2>

      <div className="my-4 small description text-muted">
        {i18n.label.passwordChangedDescription}
      </div>

      <Button
        color="primary"
        block
        className="mt-5 btn-continue"
        onClick={() => navigate('/auth')}
      >
        {i18n.button.goToSignIn}
      </Button>
    </div>
  );
}

export default ChangePasswordSuccess;
