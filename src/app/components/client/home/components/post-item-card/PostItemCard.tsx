import DOMPurify from 'dompurify';
import mime from 'mime';
import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, NavLink } from 'react-router-dom';
import VisibilitySensor from 'react-visibility-sensor';
import {
  Card, CardBody, CardImg, CardText, CardTitle,
} from 'reactstrap';
import { useSwiperSlide } from 'swiper/react';

import { useShareLinkModal } from '@app/providers/share-provider/ShareProvider';
import appConfig from '@config/app';
import VoteGroup from '@shared/components/VoteGroup/VoteGroup';
import {
  dateToCalendar, dateToTime, getProfileLink, shortNumberFormat,
} from '@shared/helpers';
import useAppTheme from '@shared/hooks/useAppTheme';
import useThumbnail from '@shared/hooks/useThumbnail';
import { useVoteControls } from '@shared/hooks/useVoteControls';
import {
  CommentIcon,
} from '@shared/icons';
import EventIcon from '@shared/icons/EventIcon';
import SocialShare from '@shared/icons/SocialShare';
import Avatar from '@shared/utils/Avatar/Avatar';

import './PostItemCard.scss';

interface PostItemCardProps {
  item: any;
  view?: string;
}

function PostItemCard({ item, view }: PostItemCardProps) {
  const videoRef = useRef<any>(null);
  const [ isVisible, setIsVisible ] = useState(false);
  const getMediaType = () => mime.getType(item.media_type);
  const swiperSlide = useSwiperSlide();
  const { voteControls } = useVoteControls({ votable_id: item.id, votable_type: 'Post' });
  const { toggle: toggleShare, setLink, setShareData } = useShareLinkModal();
  const { thumbnail } = useThumbnail(item);
  const isLgScreen = useMediaQuery({ query: '(min-width: 1200px)' });

  const handleShare = () => {
    setShareData({
      data_id: item?.id,
      data_type: 'Post',
      receiver_id: item?.owner?.id,
    });
    setLink(`${appConfig.baseUrl}/posts/${item?.id}`);
    toggleShare(true);
  };
  const { logo } = useAppTheme();

  useEffect(() => {
    if (!videoRef.current) return;
    if (isVisible && swiperSlide?.isActive) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [ isVisible, swiperSlide?.isActive ]);

  const getThumbnail = () => {
    const img = isLgScreen ? item.preview_image_urls?.md : item.preview_image_urls?.sm;
    if (img) {
      return (
        <CardImg
          top
          src={img || logo}
          height={185}
          style={{
            objectFit: img && view === 'grid' ? 'cover' : 'contain',
          }}
        />
      );
    }

    return thumbnail;
  };

  return (
    <Card className="post-item-card">
      {getMediaType()?.startsWith('video') ? (
        <VisibilitySensor onChange={(v: boolean) => setIsVisible(v)}>
          <video
            ref={videoRef}
            src={item.media_url}
            className="card-img-top"
            controls
          />
        </VisibilitySensor>
      ) : (
        getThumbnail()
      )}
      <CardBody>
        <CardTitle className="fw-bold mb-0">
          <Link to={`/posts/${item?.id}`} className="text-body fw-bold">{item.title}</Link>
        </CardTitle>
        <CardText
          className="mb-1"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 1, // Show full text if expanded
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            wordBreak: 'break-all',
          }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description) }}
        />
        {item.event && (
          <NavLink to={`/events/${item.event.id}`}>
            <div className="d-flex align-items-center mb-2 event text-truncate">
              <EventIcon className="me-2 event-icon" />
              <div style={{
                display: '-webkit-box',
                WebkitLineClamp: 1, // Show full text if expanded
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                wordBreak: 'break-all',
              }}
              >{item.event?.name}
              </div>
            </div>
          </NavLink>
        )}

        <div className="d-flex align-items-center owner-section">
          <NavLink to={getProfileLink(item.owner)}>
            <Avatar
              user={item.owner || {}}
              size="sm"
            />
          </NavLink>
          <div className="flex-fill ms-2">
            <NavLink to={getProfileLink(item.owner)} className="link text-body">
              <div
                className="text-truncate"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 1, // ony show 1 line
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal',
                  wordBreak: 'break-all',
                }}
              >
                {item.owner?.name || item.owner?.display_name}
              </div>
            </NavLink>
            <small className="text-muted">
              {dateToCalendar(item.posted_at)}, {dateToTime(item.posted_at)}
            </small>
          </div>
        </div>

        <div className="social mt-3">
          <VoteGroup
            item={item}
            upvoteRequest={() => voteControls.upVote}
            downvoteRequest={() => voteControls.downVote}
          />

          <div className="flex-fill" />

          <Link to={`/posts/${item?.id}#comments`} className="me-3" style={{ color: 'var(--bs-secondary-text)' }}>
            <CommentIcon className="me-1" />
            {shortNumberFormat(item?.comments_count)}
          </Link>

          <Link to="#" onClick={handleShare} className="share-icon">
            <SocialShare />
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}

export default PostItemCard;
