import moment from 'moment';
import React from 'react';
import { Badge } from 'reactstrap';

import GeneralMap from '@shared/components/Maps/GeneralMap';

function OrganizationLocationCard({ data }: { data: any }) {
  return (
    <div className="timeblock-card-item">
      <div className="image mb-3">
        <GeneralMap
          countryCode={data.location?.country_code}
          containerStyle={{
            height: '100%',
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
          latitude={Number.parseFloat(data.location?.latitude ?? 0)}
          longitude={Number.parseFloat(data.location?.longitude ?? 0)}
        />
      </div>
      <div className="content">
        <div className="mt-auto">
          <Badge className="primary2 me-1 mb-1">
            Location
          </Badge>
          <span className="b6 text-wrap">
            {data.location?.name}
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

export default OrganizationLocationCard;
