import moment from 'moment';
import React from 'react';
import { Badge } from 'reactstrap';

import { PreviewMedia } from '@shared/utils/preview-media';

function OrganizationCoverPhotoCard({ data }: { data: any }) {
  return (
    <div className="group-card-item h-100">
      <div className="image mb-3">
        <PreviewMedia
          previewImage={data?.cover_photo}
          mediaType=""
          videoSrc={data?.cover_photo}
        />
      </div>

      <div className="mt-auto">
        <Badge className="primary2 me-1 mb-1">
          Cover Photo
        </Badge>
      </div>
      <div className="caption1 mt-1 text-wrap description">
        {moment(data.started_at).format('DD MMM YYYY')}
        {' - '}
        {data?.ended_at ? moment(data.ended_at).format('DD MMM YYYY') : 'Present'}
      </div>
    </div>
  );
}

export default OrganizationCoverPhotoCard;
