/* eslint-disable react/no-danger */
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import React, { MouseEvent } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useShareLinkModal } from '@app/providers/share-provider/ShareProvider';
import appConfig from '@config/app';
import VoteGroup from '@shared/components/VoteGroup/VoteGroup';
import {
  dateToCalendar, dateToTime, getProfileLink, shortNumberFormat,
} from '@shared/helpers';
import useThumbnail from '@shared/hooks/useThumbnail';
import { useVoteControls } from '@shared/hooks/useVoteControls';
import { CommentIcon } from '@shared/icons';
import SocialShare from '@shared/icons/SocialShare';
import Avatar from '@shared/utils/Avatar/Avatar';
import './PostCard.scss';
import { PreviewMedia } from '@shared/utils/preview-media';

interface PostCardProps {
  post: any;
  onClick?: () => void;
}

function PostCard({ post, onClick }: PostCardProps) {
  const { voteControls } = useVoteControls({ votable_id: post?.id, votable_type: 'Post' });
  const { toggle: toggleShare, setLink, setShareData } = useShareLinkModal();
  const { thumbnail } = useThumbnail(post);

  const handleShare = () => {
    setShareData({
      data_id: post?.id,
      data_type: 'Post',
      receiver_id: post?.owner?.id,
    });

    setLink(`${appConfig.baseUrl}/posts/${post?.id}`);
    toggleShare(true);
  };

  const getThumbnail = () => {
    if (post?.preview_image_urls) {
      return (
        <div className="image">
          <PreviewMedia
            previewImage={post?.preview_image_urls}
            mediaType={post?.media_type}
            videoSrc={post?.media_url}
          />
        </div>
      );
    }

    if (!post?.preview_image_urls && post?.description) {
      return null;
    }

    return thumbnail;
  };

  const handleViewPost = (e: MouseEvent<any>) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <div className="post-card" id={post?.id}>
      <Link to={`/posts/${post?.id}`} className="stretched-link" target="_blank" onClick={handleViewPost} />
      {getThumbnail()}
      <div className="content h-100">
        <div className="b6 title text-body text-truncate">{post?.title}</div>
        <div className={classNames({
          'b5 description': true,
          'text-truncate': post?.preview_image_urls,
          'description-only': !post?.preview_image_urls && post?.description,
        })}
        >
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post?.description) }} />
        </div>
        <div className="organization mt-auto pt-2">
          <NavLink to={getProfileLink(post.owner)} target="_blank">
            <Avatar
              user={post.owner}
              size="sm"
            />
          </NavLink>
          <div className="info">
            <NavLink to={getProfileLink(post.owner)} target="_blank">
              <div className="b3">{post.owner?.display_name || post.owner?.name}</div>
            </NavLink>
            <div className="caption1">
              {dateToCalendar(post.posted_at)}, {dateToTime(post.posted_at)}
            </div>
          </div>
        </div>
        <div className="social">
          <div className="vote">
            <VoteGroup
              item={post}
              upvoteRequest={() => voteControls.upVote}
              downvoteRequest={() => voteControls.downVote}
            />
          </div>
          <div className="interaction">
            <Link to={`/posts/${post.id}#comments`} className="comment">
              <CommentIcon />
              <span className="b5">
                {shortNumberFormat(post.comments_count)}
              </span>
            </Link>
            <Link to="#" onClick={handleShare} className="share">
              <SocialShare />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
