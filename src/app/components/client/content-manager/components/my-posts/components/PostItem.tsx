/* eslint-disable react/no-danger */
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

import defaultImage from '@assets/img/vublox-logo-dark.png';
import { dateToCalendar, dateToTime } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import MoreIcon from '@shared/icons/MoreIcon';
import TimelineIcon from '@shared/icons/TimelineIcon';
import { ImageType, LocationType } from 'types';
import './PostItem.scss';

interface MentionType {
  name: string;
  id: string;
  organizations: {
    name: string;
  }
}

interface TagType {
  id: string;
  name: string;
}

interface PostProps {
  post: {
    id: string;
    title: string;
    description: string;
    media_url: string;
    preview_image_urls: ImageType;
    postable_type: string;
    posted_at: Date;
    location: LocationType;
    organization: any;
    event: any;
    mentions: MentionType[];
    tags: TagType[];
    categorize: any;
  };
  isSelected?: boolean;
}

function PostItem({ post, isSelected }: PostProps) {
  const i18n = useTranslation('contentManager');
  const [ expanded, setExpanded ] = useState(false);

  const getPostable = () => {
    let postable = post.postable_type?.toLowerCase();

    if (postable === 'organization') {
      postable = 'postable_organization';
    }

    const postCopy: any = { ...post };
    return postCopy[`${postable}`]?.name;
  };

  const getCategorizedRedirection = () => {
    let postable = post.postable_type?.toLowerCase();

    if (postable === 'organization') {
      postable = 'postable_organization';
    }

    const postCopy: any = { ...post };

    if (postable === 'event') {
      return `/events/${postCopy[`${postable}`]?.id}`;
    }

    if (postable === 'timeline') {
      return `/timelines/${postCopy[`${postable}`]?.id}`;
    }

    if (postable === 'postable_organization') {
      return `/organizations/${postCopy[`${postable}`]?.id}`;
    }
    if (postable === 'location') {
      return `/locations/${post?.location?.slug}`;
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
    <div className={`post-item ${isSelected ? 'selected' : ''}`}>
      <UncontrolledDropdown
        className="more-menu"
        direction="end"
      >
        <DropdownToggle>
          <div>
            <MoreIcon />
          </div>
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem onClick={() => toast.info(i18n.info.upcoming)}>
            <div className="b5 text-body">{i18n.posts.boost}</div>
          </DropdownItem>
          <DropdownItem onClick={() => toast.info(i18n.info.upcoming)}>
            {i18n.posts.downloadMedia}
          </DropdownItem>
          <DropdownItem onClick={() => toast.info(i18n.info.upcoming)}>
            {i18n.posts.viewAnalytics}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>

      <div className="post-item-header">
        <img
          className={classNames({
            image: true,
            'image-default': !post?.preview_image_urls,
          })}
          src={post?.preview_image_urls?.md || defaultImage}
          alt={post?.title}
        />
        <div className="informations">
          <div className="title">
            <Link to={`/posts/${post?.id}`} className={`b4 text-body ${expanded ? 'text-wrap' : 'text-truncate'}`}>{post?.title}</Link>
          </div>
          <div className={`b5 description ${expanded ? 'text-wrap' : 'text-truncate'}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post?.description) }} />
          <div className="dates">
            <div className="b5">{dateToCalendar(post?.posted_at)} {dateToTime(post?.posted_at)}</div>
            {post?.location && (
              <React.Fragment>
                <div className="separator" />
                <Link to={`/locations/${post?.location?.slug}`} className="b5">{post?.location?.name}</Link>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
      {expanded && (
        <React.Fragment>
          <div className="tags">
            <div className="caption1">{i18n.posts.categorizedUnder}</div>
            <div className="categorized">
              <div className="badge">
                <TimelineIcon />
                <span className="badge2">{post?.categorize?.name}</span>
              </div>
              <Link to={getCategorizedRedirection()} className="b3 text-body text-truncate">{getPostable()}</Link>
            </div>
          </div>
          <div className="tags">
            <div className="caption1">{i18n.posts.mentions}</div>
            <div className="tag-items">
              {(post?.mentions || [])?.length <= 0 && <span className="caption1">-</span>}
              {post?.mentions?.map((mention: MentionType) => (
                <Link to={getMentionLink(mention)} className="tag-item caption1" key={mention?.id}>{mention?.name}</Link>
              ))}
            </div>
          </div>
          <div className="tags">
            <div className="caption1">{i18n.posts.tags}</div>
            <div className="tag-items">
              {(post?.tags || [])?.length <= 0 && <span className="caption1">-</span>}
              {post?.tags?.map((tag: TagType) => (
                <div className="tag-item caption1" key={tag?.id}>{tag?.name}</div>
              ))}
            </div>
          </div>
        </React.Fragment>
      )}
      <div className="actions">
        <Link to="#" onClick={() => setExpanded(!expanded)}>
          {expanded ? i18n.posts.viewLess : i18n.posts.viewMore}
        </Link>
      </div>
    </div>
  );
}

export default PostItem;
