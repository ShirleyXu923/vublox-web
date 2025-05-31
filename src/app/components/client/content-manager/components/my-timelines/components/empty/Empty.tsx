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
        <div className="b5">{i18n.timelines.noTimelines}.</div>
        <div className="button-wrap">
          <Button label={i18n.timelines.createATimeline} onClick={() => navigate('/timelines/create')} />
        </div>
      </div>
    </div>
  );
}

export default Empty;
