import moment from 'moment';
import React from 'react';
import { Badge } from 'reactstrap';

import './OrganizationBioCard.scss';

function OrganizationBioCard({ data }: { data: any }) {
  return (
    <div className="org-bio-timeline-card-container">
      <div className="group-card-item h-100">
        <div
          className="b5 mt-2 pb-2 text-wrap text-body"
        >
          <Badge className="primary2 me-1 mb-1">
            Bio
          </Badge>
          <span>{data.bio}</span>
        </div>
        <div className="caption1 mt-auto text-wrap description">
          {moment(data.started_at).format('DD MMM YYYY')}
          {' - '}
          {data?.ended_at ? moment(data.ended_at).format('DD MMM YYYY') : 'Present'}
        </div>
      </div>
    </div>
  );
}

export default OrganizationBioCard;
