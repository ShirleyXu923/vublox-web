import React from 'react';
import { useParams } from 'react-router-dom';

import { Timeline } from '@shared/components/AccordionTimeline/components/timeline';
import TimelineMap from '@shared/components/TimelineMap/TimelineMap';

import EventContent from './components/event-content/EventContent';

function EventPage() {
  const params = useParams();

  return (
    <div className="full-container event-page pt-5">
      <EventContent
        id={params.id}
        TimelineMapComponent={TimelineMap}
        TimelineComponent={Timeline}
      />
    </div>
  );
}

export default EventPage;
