/* eslint-disable react/no-danger */
import DOMPurify from 'dompurify';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useShareLinkModal } from '@app/providers/share-provider/ShareProvider';
import appConfig from '@config/app';
import VoteGroup from '@shared/components/VoteGroup/VoteGroup';
import {
  dateToCalendar, dateToTime, getProfileLink, shortNumberFormat,
} from '@shared/helpers';
import { useVoteControls } from '@shared/hooks/useVoteControls';
import { CommentIcon } from '@shared/icons';
import SocialShare from '@shared/icons/SocialShare';
import Avatar from '@shared/utils/Avatar/Avatar';
import ImagePlaceholder from '@shared/utils/ImagePlaceholder/ImagePlaceholder';
import './PostCard.scss';
import { PreviewMedia } from '@shared/utils/preview-media';

interface PostCardProps {
  post: any;
}

function PostCard({ post }: PostCardProps) {
  const { voteControls } = useVoteControls({ votable_id: post?.id, votable_type: 'Post' });
  const { toggle: toggleShare, setLink, setShareData } = useShareLinkModal();

  const handleShare = () => {
    setShareData({
      data_id: post?.id,
      data_type: 'Post',
      receiver_id: post?.owner?.id,
    });
    setLink(`${appConfig.baseUrl}/posts/${post?.id}`);
    toggleShare(true);
  };

  return (
    <div className="post-group-post-card" id={post?.id}>
      {post?.preview_image_urls ? (
        <div className="image">
          <PreviewMedia
            previewImage={post?.preview_image_urls}
            mediaType={post?.media_type}
            videoSrc={post?.media_url}
          />
        </div>
      ) : (
        <ImagePlaceholder className="image" width="50%" />
      )}
      <div className="content">
        <Link to={`/posts/${post?.id}`} className="b6 title text-body text-truncate">{post?.title}</Link>
        <div className="b5 description text-truncate">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post?.description) }} />
        </div>
        <div className="organization">
          <NavLink to={getProfileLink(post.owner)}>
            <Avatar
              user={post.owner}
              size="sm"
            />
          </NavLink>
          <div className="info">
            <NavLink to={getProfileLink(post.owner)}>
              <div className="b3">{post.owner?.display_name || post.owner?.name}</div>
            </NavLink>
            <div className="caption1">{dateToCalendar(post.posted_at)}, {dateToTime(post.posted_at)}</div>
          </div>
        </div>
        <div className="social">
          <VoteGroup
            item={post}
            upvoteRequest={() => voteControls.upVote}
            downvoteRequest={() => voteControls.downVote}
          />
          <div className="interaction">
            <NavLink to={`/posts/${post.id}#comments`} className="comment">
              <CommentIcon />
              <span className="b5">
                {shortNumberFormat(post.comments_count)}
              </span>
            </NavLink>
            <div className="share" onClick={handleShare}>
              <SocialShare />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
