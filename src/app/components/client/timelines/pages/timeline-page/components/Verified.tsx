import React from 'react';

import LocaleService from '@services/LocaleService';
import { VerifiedIcon } from '@shared/icons';
import './Verified.scss';

function Verified() {
  const i18n = LocaleService.getTranslations('timelinePage');
  return (
    <div className="verified">
      <VerifiedIcon />
      <div className="caption2">{i18n.label.verified}</div>
    </div>
  );
}

export default Verified;
