import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './ShareNotification.scss';

import { getNotificationsRequest, readNotificationRequest } from '@reducers/auth/AuthAction';
import { handleError } from '@services/ErrorHandler';
import { shortedFromNow } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import NotifShareIcon from '@shared/icons/NotifShareIcon';
import Avatar from '@shared/utils/Avatar/Avatar';

interface ShareNotificationProps {
  unread?: boolean;
  notification: any;
}

function ShareNotification({ unread, notification }: ShareNotificationProps) {
  const i18n = useTranslation('notifications');
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const getLink = () => {
    let link = '#';

    if (notification?.data_type === 'Organization') {
      link = `/organizations/${notification?.data_id}`;
    }

    if (notification?.data_type === 'Event') {
      link = `/events/${notification?.data_id}`;
    }

    if (notification?.data_type === 'Location') {
      link = `/locations/${notification?.data_id}`;
    }

    if (notification?.data_type === 'Profile') {
      link = `/profile/${notification?.data_id}`;
    }

    if (notification?.data_type === 'Post') {
      link = `/posts/${notification?.data_id}`;
    }

    if (notification?.data_type === 'Timeline') {
      link = `/timelines/${notification?.data_id}`;
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
    <Link className="share-notification notification-item" to={getLink()} onClick={readNotification}>
      <div className={`wrapper ${unread ? 'unread' : ''}`}>
        <div className="logo">
          <Avatar user={notification?.sender} size="md" />
          <div className="icon">
            <NotifShareIcon />
          </div>
        </div>
        <div className="data">
          <div className="title">
            <div className="b6">{notification?.sender?.name || notification?.sender?.display_name}</div>
          </div>
          <div className="message">
            <div className="b5">{i18n.label.sharedYour} {notification?.data_type?.toLowerCase()}. <span className="dot">•</span></div>
            <div className="b5 time">{shortedFromNow(notification?.created_at)}</div>
          </div>
        </div>
        {unread && <div className="unread-icon" />}
      </div>
    </Link>
  );
}

export default ShareNotification;
