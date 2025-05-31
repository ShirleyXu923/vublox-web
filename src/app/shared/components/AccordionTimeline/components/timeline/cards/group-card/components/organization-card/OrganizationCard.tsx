import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';

import FollowLink from '@shared/buttons/follow-button/FollowLink';
import useThumbnail from '@shared/hooks/useThumbnail';
import Avatar from '@shared/utils/Avatar/Avatar';

function OrganizationCard({ data, onClick }: { data: any; onClick?: () => void }) {
  const { thumbnail } = useThumbnail(data);

  const getThumbnail = () => {
    if (data?.logo?.sm || data?.cover_image?.sm) {
      return (
        <img src={data.logo?.md} alt="Logo" className="logo" />
      );
    }

    return thumbnail;
  };

  return (
    <div className="group-card-item">
      <Link className="stretched-link" to={`/organizations/${data.id}`} target="_blank" onClick={onClick} />
      <div className="image d-flex align-items-center justify-content-center">
        {getThumbnail()}
      </div>

      <div className="mt-3">
        <Badge className="primary2 me-1 mb-1">
          Organization
        </Badge>
        <span className="b6 text-wrap">
          {data.name}
        </span>
      </div>
      <div className="d-flex align-items-center gap-2 mt-2">
        <Avatar user={data.owner} size="sm" />
        <div>
          <div className="d-flex align-items-center">
            <span>{data?.owner?.display_name}</span>
            <FollowLink followId={data?.owner?.id} followType="Client" sufix="Creator" />
          </div>
          <div className="caption1 text-truncate secondary-text creator d-flex align-items-center">
            <span>{moment(data.started_at).format('DD MMM YYYY, hh:mm A')}</span>
            {data.location && (
              <React.Fragment>
                <span className="dot" />
                <span className="text-truncate">{data.location.name}</span>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationCard;
