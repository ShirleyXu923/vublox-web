import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './CommentNotification.scss';

import { getNotificationsRequest, readNotificationRequest } from '@reducers/auth/AuthAction';
import { handleError } from '@services/ErrorHandler';
import { shortedFromNow } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import NotifCommentIcon from '@shared/icons/NotifCommentIcon';
import Avatar from '@shared/utils/Avatar/Avatar';

interface CommentNotificationProps {
  unread?: boolean;
  notification?: any;
}

function CommentNotification({ unread, notification }: CommentNotificationProps) {
  const i18n = useTranslation('notifications');
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const getLink = () => {
    let link = '#';
    if (notification?.data_type === 'Post') {
      link = `/posts/${notification?.data_id}#comments`;
    }

    return link;
  };

  const readNotification = async () => {
    try {
      await dispatch(readNotificationRequest(notification?.id)).$promise;
      navigate(getLink());
      await dispatch(getNotificationsRequest()).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  return (
    <Link to={getLink()} onClick={readNotification} className="comment-notification notification-item">
      <div className={`wrapper ${unread ? 'unread' : ''}`}>
        <div className="logo">
          <Avatar user={notification?.sender} size="md" />
          <div className="icon">
            <NotifCommentIcon />
          </div>
        </div>
        <div className="data">
          <div className="title">
            <div className="b6">{notification?.sender?.name || notification?.sender?.display_name}</div>
          </div>
          <div className="message">
            <div className="b5">{i18n.label.commentedOnYour} {notification?.data_type?.toLowerCase()} <span className="dot">•</span></div>
            <div className="b5 time">{shortedFromNow(notification?.created_at)}</div>
          </div>
        </div>
        {unread && <div className="unread-icon" />}
      </div>
    </Link>
  );
}

export default CommentNotification;
