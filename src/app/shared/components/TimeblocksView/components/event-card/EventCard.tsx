import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge } from 'reactstrap';

import { getProfileLink } from '@shared/helpers';
import useThumbnail from '@shared/hooks/useThumbnail';
import Avatar from '@shared/utils/Avatar/Avatar';
import { PreviewMedia } from '@shared/utils/preview-media';

function EventCard({ data, onClick }: { data: any; onClick?: () => void }) {
  const { thumbnail } = useThumbnail(data);
  const home = data?.metadata?.competitors?.find?.((c: any) => c.qualifier === 'home');
  const away = data?.metadata?.competitors?.find?.((c: any) => c.qualifier === 'away');

  const getThumbnail = () => {
    if (data?.banner_url) {
      return (
        <div className="image">
          <PreviewMedia
            previewImage={data?.banner_url}
            mediaType=""
            videoSrc={data?.banner_url}
          />
        </div>
      );
    }

    if (!data?.banner_url && data?.metadata) {
      return (
        <div className="scores">
          <div className="competitor">
            {home.image_path && <img src={home.image_path} alt="Home" className="team-logo" loading="lazy" />}
          </div>
          {data.metadata.home_score || '0'}
          {' - '}
          {data.metadata.away_score || '0'}
          <div className="competitor">
            {away.image_path && <img src={away.image_path} alt="Away" className="team-logo" loading="lazy" />}
          </div>
        </div>
      );
    }

    if (!data?.banner_url && data?.description) {
      return null;
    }

    return thumbnail;
  };

  const getAvatars = () => {
    if (!data.coCreators) {
      return (
        <div className="avatar me-2">
          <Avatar user={data.owner} size="sm" />
        </div>
      );
    }
    const coCreator = data.coCreators[0];
    return (
      <div className="avatar avatar__consolidate me-2">
        <Avatar user={coCreator.creator} size="sm" className="avatar__2" />
        <Avatar user={data.owner} size="sm" className="avatar__1" />
      </div>
    );
  };

  return (
    <div className="timeblock-card-item">
      <Link className="stretched-link" to={`/events/${data.id}`} target="_blank" onClick={onClick} />
      {getThumbnail()}
      <div className="title">
        <div className={classNames({
          'd-flex align-items-center': true,
        })}
        >
          <Badge className="primary2 me-1">
            Event
          </Badge>
          <div className="d-flex align-items-center text-truncate wrap">
            <Link className="b6 text-truncate" to={`/events/${data.id}`} style={{ color: 'var(--bs-body-color)' }}>
              {data.name}
            </Link>
          </div>
        </div>
        {!data?.banner_url && data?.description && !data?.metadata && (
          <div className="description-only mt-2">{data.description}</div>
        )}
        {(data?.banner_url || data.metadata) && (
          <div
            className={classNames({
              b5: true,
              'mt-1': true,
              'mb-2': true,
              'text-truncate': data?.banner_url,
            })}
            style={{ color: 'var(--bs-description-color)' }}
          >
            {data.description}
          </div>
        )}
      </div>
      <div className="content mt-auto pt-0 relative text-truncate">
        <Link className="stretched-link" to={`/events/${data.id}`} target="_blank" onClick={onClick} />
        <div className="d-flex align-items-center">
          {getAvatars()}
          <div className="me-1">
            <div className="description caption1">
              <div>
                {(data.coCreators?.length > 0 || data.owner) && (
                  <div className="caption1 text-truncate">
                    Organized by&nbsp;
                    <NavLink to={getProfileLink(data.owner)} className="link">
                      {data.owner?.name || data.owner?.display_name || data.owner?.full_name}
                    </NavLink>
                    {data.coCreators?.length > 0 && (
                      <span
                        className="cursor-pointer text-primary"
                      >
                        {` +${data.coCreators.length}`}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="caption1 text-truncate creator d-flex align-items-center" style={{ color: 'var(--bs-secondary-text)' }}>
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
    </div>
  );
}

export default EventCard;
