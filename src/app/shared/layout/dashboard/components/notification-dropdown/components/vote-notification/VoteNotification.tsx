import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './VoteNotification.scss';

import { getNotificationsRequest, readNotificationRequest } from '@reducers/auth/AuthAction';
import { handleError } from '@services/ErrorHandler';
import { shortedFromNow } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import NotifVoteIcon from '@shared/icons/NotifVoteIcon';
import Avatar from '@shared/utils/Avatar/Avatar';

interface VoteNotificationProps {
  unread?: boolean;
  notification: any;
}

function VoteNotification({ unread, notification }: VoteNotificationProps) {
  const i18n = useTranslation('notifications');
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const readNotification = async () => {
    try {
      await dispatch(readNotificationRequest(notification?.id)).$promise;
      navigate(`/posts/${notification?.data_id}${notification?.data_type === 'Comment' ? '#comments' : ''}`);
      await dispatch(getNotificationsRequest()).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  const getAdditionalNames = () => {
    let senderNames = '';
    const additionalLength = notification?.senders?.length;
    if (additionalLength > 0) {
      senderNames = `${notification?.senders?.[0]?.profile?.first_name}`;
    }

    if (additionalLength === 1) {
      senderNames = ` and ${senderNames}`;
    } else {
      senderNames = additionalLength > 0 ? `, ${senderNames} ` : '';
    }

    return senderNames;
  };

  return (
    <Link className="vote-notification notification-item" to={`/posts/${notification?.data_id}${notification?.data_type === 'Comment' ? '#comments' : ''}`} onClick={readNotification}>
      <div className={`wrapper ${unread ? 'unread' : ''}`}>
        <div className="logo">
          {notification?.senders?.length > 0
            ? (
              <React.Fragment>
                <Avatar user={notification?.senders[0]} size="sm" className="logo-image-2" />
                <Avatar user={notification?.sender} size="sm" className="logo-image" />
              </React.Fragment>
            )
            : (
              <Avatar user={notification?.sender} size="md" />
            )}
          <div className="icon">
            <NotifVoteIcon />
          </div>
        </div>
        <div className="data">
          <div className="title">
            <div className="b6">
              {notification?.sender?.name || notification?.sender?.display_name}
              {getAdditionalNames()}
              {notification?.senders?.length > 1 && (
                <span className="b5"> {i18n.label.and} </span>
              )}
              {notification?.senders?.length > 1 ? `${notification.senders.length - 1} ${i18n.label.more}` : ''}
            </div>
          </div>
          <div className="message">
            <div className="b5">{i18n.label.upvotedYour} {notification?.data_type?.toLowerCase()}. <span className="dot">•</span></div>
            <div className="b5 time">{shortedFromNow(notification?.created_at)}</div>
          </div>
        </div>
        {unread && <div className="unread-icon" />}
      </div>
    </Link>
  );
}

export default VoteNotification;
