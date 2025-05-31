import moment from 'moment';
import React from 'react';
import { Badge } from 'reactstrap';

function OrganizationNameCard({ data }: { data: any }) {
  return (
    <div className="timeblock-card-item">
      <div className="image d-flex align-items-center justify-content-center mb-3">
        <h1 className="s2">
          {data.name}
        </h1>
      </div>

      <div className="content">
        <div className="mt-auto">
          <Badge className="primary2 me-1 mb-1">
            Name
          </Badge>
          <span className="b6 text-wrap">
            {data.name}
          </span>
        </div>
        <div className="caption1 mt-1 text-wrap description">
          {moment(data.started_at).format('DD MMM YYYY')}
          {' - '}
          {data?.ended_at ? moment(data.ended_at).format('DD MMM YYYY') : 'Present'}
        </div>
      </div>
    </div>
  );
}

export default OrganizationNameCard;
