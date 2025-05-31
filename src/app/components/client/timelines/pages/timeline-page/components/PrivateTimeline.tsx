import React from 'react';
import { Col } from 'reactstrap';

import LocaleService from '@services/LocaleService';
import { InfoIcon } from '@shared/icons';
import AlertInvitation from '@shared/utils/AlertInvitation/AlertInvitation';

interface Props {
  eventData?: any;
}

function PrivateTimeline({ eventData }: Props) {
  const i18n = LocaleService.getTranslations('timelinePage');
  return (
    <Col className="timeline">
      <div className="s1 mb-4 mt-5">{i18n.label.timeline}</div>
      {eventData?.invite && (<AlertInvitation icon={<InfoIcon />} event={eventData} />)}
      <p className="b1" style={{ color: 'var(--bs-secondary-text)' }}>{i18n.label.privateTimeline}</p>
    </Col>
  );
}

export default PrivateTimeline;
