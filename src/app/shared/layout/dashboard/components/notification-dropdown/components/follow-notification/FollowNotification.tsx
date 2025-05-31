import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './FollowNotification.scss';

import { getNotificationsRequest, readNotificationRequest } from '@reducers/auth/AuthAction';
import { followPageRequest } from '@reducers/follow/FollowAction';
import { handleError } from '@services/ErrorHandler';
import { getFormData, shortedFromNow } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import NotifFollowIcon from '@shared/icons/NotifFollowIcon';
import Avatar from '@shared/utils/Avatar/Avatar';

interface FollowNotificationProps {
  unread?: boolean;
  notification: any;
}

function FollowNotification({ unread, notification }: FollowNotificationProps) {
  const i18n = useTranslation('notifications');
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const getLink = () => {
    let link = '#';

    if (notification?.data_type === 'Client') {
      link = `/profile/${notification?.data_id}`;
    }

    if (notification?.data_type === 'Organization') {
      link = `/organizations/${notification?.data_id}`;
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

  const followBack = async () => {
    try {
      const formData = getFormData({
        followable_id: notification?.sender_id,
        followable_type: 'Client',
      });

      await dispatch(followPageRequest(formData)).$promise;
      await dispatch(getNotificationsRequest()).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  return (
    <div className="follow-notification notification-item">
      <div className={`wrapper ${unread ? 'unread' : ''}`}>
        <Link to={getLink()} onClick={readNotification} className="logo">
          <Avatar user={notification?.sender} size="md" />
          <div className="icon">
            <NotifFollowIcon />
          </div>
        </Link>
        <div className="data">
          <div className="title">
            <Link to={getLink()} onClick={readNotification} className="b6">{notification?.sender?.name || notification?.sender?.display_name}</Link>
            {notification?.is_following
              ? (
                <div className="caption1">{i18n.label.following}</div>
              )
              : (
                <Link to="#" className="caption2" onClick={followBack}>{i18n.label.followBack}</Link>
              )}
          </div>
          <div className="message">
            <div className="b5">{i18n.label.startedFollowing}</div>
            <span className="dot">•</span>
            <div className="b5 time">{shortedFromNow(notification?.created_at)}</div>
          </div>
        </div>
        {unread && <div className="unread-icon" />}
      </div>
    </div>
  );
}

export default FollowNotification;
