import {
  useParams,
} from 'react-router-dom';

import { Timeline } from '@shared/components/AccordionTimeline/components/timeline';
import TimelineMap from '@shared/components/TimelineMap/TimelineMap';

import TimelineContent from './components/timeline-content/TimelineContent';

function TimelinePage() {
  const params = useParams();
  return (
    <TimelineContent
      id={params?.id}
      TimelineMapComponent={TimelineMap}
      TimelineComponent={Timeline}
    />
  );
}

export default TimelinePage;
