import './Empty.scss';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@shared/buttons/Button';
import useTranslation from '@shared/hooks/useTranslation';

function Empty() {
  const i18n = useTranslation('contentManager');
  const navigate = useNavigate();

  return (
    <div className="empty-container">
      <div className="empty-body">
        <div className="b5">{i18n.events.emptyEvent}.</div>
        <div className="button-wrap">
          <Button label={i18n.events.createAnEvent} onClick={() => navigate('/events/create#step-1')} />
        </div>
      </div>
    </div>
  );
}

export default Empty;
