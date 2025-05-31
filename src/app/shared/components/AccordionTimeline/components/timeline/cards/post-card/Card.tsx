/* eslint-disable react/no-danger */
/* eslint-disable camelcase */
import DOMPurify from 'dompurify';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import {
  dateToCalendar, dateToTime, getProfileLink, shortNumberFormat,
} from '@shared/helpers';
import {
  CommentIcon,
  DownvoteIcon,
  UpvoteIcon,
} from '@shared/icons';
import Ellipse from '@shared/icons/Ellipse';
import SocialShare from '@shared/icons/SocialShare';
import Avatar from '@shared/utils/Avatar/Avatar';
import { ImageType, LocationType } from 'types';

import { Verified } from '../../components/verified';

interface CardProps {
  id: string;
  title: string;
  description: string;
  preview_image_urls: ImageType;
  created_at: Date;
  location: LocationType;
  owner: any;
  upvote_count: number;
  comment_count: number;
}

function Card({
  id,
  title,
  description,
  preview_image_urls,
  created_at,
  location,
  owner = {},
  ...post
}: CardProps) {
  return (
    <div className="child-card">
      <div className="content">
        {preview_image_urls && (
          <div className="image">
            <img className="main-image" height={249} width={395} src={preview_image_urls.md} alt="" />
            <Verified />
          </div>
        )}
        {/* Contents here should be dynamic once the posts module is finished */}
        <div className="informative">
          <div className="b2 text-truncate">
            <Link to={`/posts/${id}`} className="text-body">{title}</Link>
          </div>
          <div className="b5 description text-truncate" style={{ maxWidth: '400px' }}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} />
          </div>
          <div className="organization">
            <NavLink to={getProfileLink(owner)}>
              <Avatar
                user={owner}
                size="sm"
              />
            </NavLink>
            <div className="info">
              <div className="name">
                <NavLink to={getProfileLink(owner)}>
                  <div className="b3">
                    {owner.name || owner.display_name}
                  </div>
                </NavLink>
              </div>
              <div className="date">
                <div className="tab">{dateToCalendar(created_at)}, {dateToTime(created_at)}</div>
                {location && (
                  <>
                    <Ellipse />
                    <NavLink to={`/locations/${location?.slug}`}>
                      <div className="tab">{location?.name}</div>
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="social">
            <div className="vote">
              <div className="upvote">
                <UpvoteIcon />
                <span>{shortNumberFormat(post.upvote_count)}</span>
              </div>
              <div className="line" />
              <div className="downvote">
                <DownvoteIcon />
              </div>
            </div>
            <div className="interaction">
              <Link to={`/posts/${id}#comments`} className="comment">
                <CommentIcon />
                <span className="b5">{shortNumberFormat(post.comment_count)}</span>
              </Link>
              <div className="share">
                <SocialShare />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
