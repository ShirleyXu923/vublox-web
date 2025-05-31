import React from 'react';

import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';

function VenueOverlay({ event }: { event: any }) {
  const { logo } = useAppTheme();
  const i18n = useTranslation('eventPage');
  return event.type === 'upcoming' && !event.location ? (
    <div className="venue-overlay">
      <img src={logo} height="8%" alt="logo" className="mb-3" />
      <div className="caption-1">
        {i18n.label.emptyLocation}
      </div>
    </div>
  ) : null;
}

export default VenueOverlay;
