import React from 'react';
import './Details.scss';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';

import { IRootState } from '@app/store';
import useTranslation from '@shared/hooks/useTranslation';
import TimelineIcon from '@shared/icons/TimelineIcon';

import { LocationMap } from './components/locations-map';

function Details() {
  const i18n = useTranslation('postPage');
  const post = useSelector((state: IRootState) => state.Post.post);

  const getCategorizeLink = () => {
    if (!post) return '#';
    const type = post?.categorize?.type;
    const id = post?.categorize?.id;

    if (type === 'Organization') {
      return `/organizations/${id}`;
    }

    if (type === 'Timeline') {
      return `/timelines/${id}`;
    }

    if (type === 'Event') {
      return `/events/${id}`;
    }

    return '#';
  };

  const getMentionLink = (mention: any) => {
    const type = mention?.creator_type;

    if (type === 'Organization') {
      return `/organizations/${mention?.creator_id}`;
    }

    if (type === 'Client') {
      return `/profile/${mention?.creator_id}`;
    }

    return '#';
  };

  return (
    <Col className="post-locations-tab">
      <div className="locations">
        {post?.location && (
          <div className="map-container">
            <LocationMap location={post?.location} />
          </div>
        )}
      </div>
      {post?.categorize && (
        <div className="info-block categorize-under">
          <div className="b5">{i18n.label.categorizeUnder}</div>
          <div className="categorize-info">
            <div className="badge">
              <TimelineIcon />
              <span className="badge2">{post?.categorize?.type}</span>
            </div>
            <Link to={getCategorizeLink()} className="b3">{post?.categorize?.name}</Link>
          </div>
        </div>
      )}
      {post?.mentions && post?.mentions?.length > 0 && (
        <div className="info-block mentions">
          <div className="b5">{i18n.label.mentions}</div>
          <div className="tags">
            {post?.mentions?.map((mention: any) => (
              <Link to={getMentionLink(mention)} className="tag caption1 text-body" key={mention.id}>{mention.name}</Link>
            ))}
          </div>
        </div>
      )}
      {post?.tags?.length > 0 && (
        <div className="info-block post-tags">
          <div className="b5">{i18n.label.tags}</div>
          <div className="tags">
            {post?.tags?.map((tag: any) => (
              <div className="tag caption1 text-body" key={tag.id}>{tag.name}</div>
            ))}
          </div>
        </div>
      )}
    </Col>
  );
}

export default Details;
