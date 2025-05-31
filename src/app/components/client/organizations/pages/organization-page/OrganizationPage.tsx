import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { IRootState } from '@app/store';
import { Timeline } from '@shared/components/AccordionTimeline/components/timeline';
import TimelineMap from '@shared/components/TimelineMap/TimelineMap';

import OrganizationContent from './components/organization-content/OrganizationContent';

import './OrganizationPage.scss';

function OrganizationPage() {
  const params = useParams();
  const organization = useSelector((state: IRootState) => state.Organization.organization as any);

  return (
    <OrganizationContent
      id={params.id}
      preview={false}
      defaultItem={organization}
      TimelineMapComponent={TimelineMap}
      TimelineComponent={Timeline}
    />
  );
}

export default OrganizationPage;
