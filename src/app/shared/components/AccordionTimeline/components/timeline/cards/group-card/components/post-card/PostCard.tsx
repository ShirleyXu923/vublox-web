/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/no-danger */
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, NavLink } from 'react-router-dom';
import { Badge } from 'reactstrap';

import { useShareLinkModal } from '@app/providers/share-provider/ShareProvider';
import appConfig from '@config/app';
import LocaleService from '@services/LocaleService';
import VoteGroup from '@shared/components/VoteGroup/VoteGroup';
import {
  dateToCalendar, dateToTime, getProfileLink, shortNumberFormat,
} from '@shared/helpers';
import useThumbnail from '@shared/hooks/useThumbnail';
import useTranslation from '@shared/hooks/useTranslation';
import { useVoteControls } from '@shared/hooks/useVoteControls';
import { CommentIcon, HistoryIcon } from '@shared/icons';
import SocialShare from '@shared/icons/SocialShare';
import Avatar from '@shared/utils/Avatar/Avatar';
import './PostCard.scss';
import { PreviewMedia } from '@shared/utils/preview-media';

interface PostCardProps {
  data: any;
  onClick: (data: any) => void;
}

function PostCard({ data, onClick }: PostCardProps) {
  const i18n = useTranslation('postPage');
  const { voteControls } = useVoteControls({ votable_id: data?.id, votable_type: 'Post' });
  const { toggle: toggleShare, setLink, setShareData } = useShareLinkModal();
  const [ viewMoreOpen, setViewMoreOpen ] = useState(false);
  const [ showViewMore, setShowViewMore ] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const { thumbnail } = useThumbnail(data);
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });
  useEffect(() => {
    if (descriptionRef.current) {
      // eslint-disable-next-line max-len
      const isOverflowing = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      setShowViewMore(isOverflowing);
    }
  }, [ data?.description ]);

  const handleShare = () => {
    setShareData({
      data_id: data?.id,
      data_type: 'Post',
      receiver_id: data?.owner?.id,
    });
    setLink(`${appConfig.baseUrl}/posts/${data?.id}`);
    toggleShare(true);
  };

  const getThumbnail = () => {
    if (data?.preview_image_urls) {
      return (
        <div className="image">
          <PreviewMedia
            previewImage={data?.preview_image_urls}
            mediaType={data?.media_type}
            videoSrc={data?.media_url}
          />
        </div>
      );
    }

    if (!data?.preview_image_urls && data?.description) {
      return null;
    }

    return thumbnail;
  };

  return (
    <div className="group-post-card" id={data?.id}>
      <Link to={`/posts/${data?.id}`} className="stretched-link" target="_blank" onClick={onClick} />
      <div className="image-container">
        {getThumbnail()}
        {data.type === 'historical' && (
          <div className="historical-badge caption2">
            <HistoryIcon height={13} width={13} />
            {i18n.label.historical}
          </div>
        )}
      </div>
      <div className={classNames({
        'content relative': true,
        'mt-3': data?.preview_image_urls,
      })}
      >
        <Link to={`/posts/${data?.id}`} className="stretched-link" target="_blank" onClick={onClick} />
        <div className="d-flex align-items-center">
          {!data?.preview_image_urls && data?.description && (
            <Badge className="primary2 me-2">
              Text
            </Badge>
          )}
          <div className="b6 title text-body text-truncate">{data.title}</div>
        </div>
        {/* <div className="b5 description">
          <div className="text-truncate"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data?.description) }} />
        </div> */}
        {!data?.preview_image_urls && data?.description
          ? (
            <div className="description-only">
              <div
                className="b5 description"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data?.description),
                }}
              />
            </div>
          )
          : (
            <>
              <div
                className="text-wrap text-body"
                ref={descriptionRef}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: viewMoreOpen ? 2 : 1, // Show full text if expanded
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal',
                }}
              >
                <div
                  className="b5 description"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(data?.description),
                  }}
                />
              </div>
              {showViewMore && (
                <a
                  className="caption2 primary"
                  onClick={() => setViewMoreOpen(!viewMoreOpen)}
                  aria-expanded={viewMoreOpen}
                  style={{ color: 'var(--bs-primary)', fontSize: isXsScreen ? '10px' : '12px', cursor: 'pointer' }}
                >
                  {viewMoreOpen ? i18n.label.viewLess : i18n.label.viewMore}
                </a>
              )}
            </>
          )}
        <div className="organization">
          <NavLink to={getProfileLink(data.owner)} target="_blank">
            <Avatar
              user={data.owner}
              size="sm"
            />
          </NavLink>
          <div className="info">
            <NavLink to={getProfileLink(data.owner)} target="_blank">
              <div className="b3">{data.owner?.display_name || data.owner?.name}</div>
            </NavLink>
            <div className="caption1">
              {dateToCalendar(data.posted_at)}, {dateToTime(data.posted_at)}
              {' • '}
              {`${shortNumberFormat(data?.views_count)} ${LocaleService.getPluralizedTranslation(i18n.label.views, data?.views_count, false)}`}
            </div>
          </div>
        </div>
        <div className="social">
          <VoteGroup
            item={data}
            upvoteRequest={() => voteControls.upVote}
            downvoteRequest={() => voteControls.downVote}
          />
          <div className="interaction">
            <NavLink to={`/posts/${data.id}#comments`} className="comment">
              <CommentIcon />
              <span className="b5">
                {shortNumberFormat(data.comments_count)}
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
