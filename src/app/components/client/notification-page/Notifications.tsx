import React from 'react';
import { Col, Row } from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { CommentNotification } from '@shared/layout/dashboard/components/notification-dropdown/components/comment-notification';
import { FollowNotification } from '@shared/layout/dashboard/components/notification-dropdown/components/follow-notification';
import { InviteNotification } from '@shared/layout/dashboard/components/notification-dropdown/components/invite-notification';
import { ShareNotification } from '@shared/layout/dashboard/components/notification-dropdown/components/share-notification';
import { VoteNotification } from '@shared/layout/dashboard/components/notification-dropdown/components/vote-notification';

interface NotificationsProps {
  notifications: any;
  unread?: boolean;
}

function Notifications({ notifications, unread }: NotificationsProps) {
  const i18n = useTranslation('notifications');
  const getComponent: any = (notification: any) => {
    const component = null;

    if (unread && notification?.read_at) {
      return null;
    }

    if (notification?.action === 'Comment') {
      return (
        <CommentNotification
          unread={!notification?.read_at}
          notification={notification}
        />
      );
    }

    if (notification?.action === 'Share') {
      return (
        <ShareNotification
          unread={!notification?.read_at}
          notification={notification}
        />
      );
    }

    if (notification?.action === 'Follow') {
      const placeholderNotification = {
        sender: {
          name: 'John Doe',
          display_name: 'John Doe',
          avatar_url: 'https://via.placeholder.com/150', // Replace with actual avatar URL
        },
        event_name: ' Long Ass Name Name Name Premier League Finals',
        created_at: new Date().toISOString(),
      };
      return (
        <>
          <InviteNotification
            unread={!notification?.read_at}
            notification={placeholderNotification}
          />
          <FollowNotification
            unread={!notification?.read_at}
            notification={notification}
          />
        </>
      );
    }

    if (notification?.action === 'Upvote') {
      return (
        <VoteNotification
          unread={!notification?.read_at}
          notification={notification}
        />
      );
    }
    if (notification?.action === 'Invite') {
      return (
        <InviteNotification
          unread={!notification?.read_at}
          notification={notification}
        />
      );
    }

    return component;
  };

  const isAtLeastADayAgo = (dateToCheck: Date) => {
    if (dateToCheck) {
      const now = new Date();
      const date = new Date(dateToCheck);
      const sameDay = now.getDate() === date.getDate();
      const sameMonth = now.getMonth() === date.getMonth();
      const sameYear = now.getFullYear() === date.getFullYear();

      if (sameDay && sameMonth && sameYear) {
        return false;
      }
    }

    return true;
  };

  const getTodayCount = () => {
    let count = 0;
    notifications?.map((notification: any) => {
      if (!isAtLeastADayAgo(notification?.created_at)) {
        count++;
      }

      return notification;
    });
    return count;
  };

  const getEarlierCount = () => {
    let count = 0;
    notifications?.map((notification: any) => {
      if (isAtLeastADayAgo(notification?.created_at)) {
        count++;
      }

      return notification;
    });
    return count;
  };

  return (
    <React.Fragment>
      {/* Today */}
      {getTodayCount() > 0 && (
        <Row className="notification-box">
          <div className="s3">{i18n.label.today}</div>
          <Col md={12} className="notifications">
            {notifications?.map((notification: any) => {
              if (isAtLeastADayAgo(notification?.created_at)) {
                return null;
              }

              return getComponent(notification);
            })}
          </Col>
        </Row>
      )}

      {/* Earlier */}
      {getEarlierCount() > 0 && (
        <Row className="notification-box">
          <div className="s3">{i18n.label.earlier}</div>
          <Col md={12} className="notifications">
            {notifications?.map((notification: any) => {
              if (!isAtLeastADayAgo(notification?.created_at)) {
                return null;
              }

              return getComponent(notification);
            })}
          </Col>
        </Row>
      )}
    </React.Fragment>
  );
}

export default Notifications;
