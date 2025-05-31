import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { Badge } from 'reactstrap';

import { IRootState } from '@app/store';
import FollowLink from '@shared/buttons/follow-button/FollowLink';
import useThumbnail from '@shared/hooks/useThumbnail';
import Avatar from '@shared/utils/Avatar/Avatar';
import { PreviewMedia } from '@shared/utils/preview-media';

import './TimelineCard.scss';

function TimelineCard({ data, onClick }: { data: any; onClick?: () => void }) {
  const { thumbnail } = useThumbnail(data);
  const account = useSelector((state: IRootState) => state.Auth.account);

  const getThumbnail = () => {
    if (data?.cover_image) {
      return (
        <div className="image">
          <PreviewMedia
            previewImage={data?.cover_image}
            mediaType=""
            videoSrc={data?.cover_image}
          />
        </div>
      );
    }

    if (!data?.cover_image && data?.description) {
      return null;
    }

    return thumbnail;
  };

  const getFollowType = () => {
    if (data?.owner?.display_name) {
      return 'Client';
    }

    if (data?.owner?.name) {
      return 'Organization';
    }

    return null;
  };

  const getOwnerRedirection = () => {
    if (data?.owner?.display_name) {
      return `/profile/${data?.owner?.id}`;
    }

    if (data?.owner?.name) {
      return `/organizations/${data?.owner?.id}`;
    }

    return null;
  };

  return (
    <div className="timeblock-card-item timeline">
      <Link className="stretched-link" to={`/timelines/${data?.id}`} target="_blank" onClick={onClick} />
      {getThumbnail()}
      <div className="title">
        <div className={classNames({
          'd-flex align-items-center': true,
        })}
        >
          <Badge className="primary2 me-1">
            Timeline
          </Badge>
          <div className="d-flex align-items-center text-truncate">
            <span className="b6 text-truncate">
              {data.name}
            </span>
          </div>
        </div>
        {!data?.cover_image && data?.description && (
          <div className="description-only mt-2 text-wrap">{data.description}</div>
        )}
        {data?.cover_image && data?.description && (
          <div className="b5 mt-1 text-truncate description">
            {data.description}
          </div>
        )}
      </div>
      <div className="content d-flex align-items-center gap-2 mt-auto pt-3 relative">
        <div className="relative">
          <NavLink className="link" to={getOwnerRedirection() || '#'} target="_blank">
            <Avatar user={data.owner} size="sm" />
          </NavLink>
        </div>
        <div>
          <div className="d-flex align-items-center">
            <div className="relative">
              <NavLink className="link" to={getOwnerRedirection() || '#'} target="_blank">
                <span>{data?.owner?.display_name || data?.owner?.name}</span>
              </NavLink>
            </div>
            {getFollowType() && data?.owner?.id !== account?.id && (
              <div className="relative" style={{ zIndex: 2 }}>
                <FollowLink followId={data?.owner?.id} followType={getFollowType() || 'Client'} />
              </div>
            )}
          </div>
          <div className="time caption1 relative text-truncate creator d-flex align-items-center">
            <NavLink className="link" to={getOwnerRedirection() || '#'} target="_blank" />
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

export default TimelineCard;
