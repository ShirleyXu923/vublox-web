import React from 'react';

import { CommentNotification } from '../comment-notification';
import { FollowNotification } from '../follow-notification';
import { InviteNotification } from '../invite-notification';
import { ShareNotification } from '../share-notification';
import { VoteNotification } from '../vote-notification';

interface AllNotificationsProps {
  unread?: boolean;
  notifications: any[];
}

function AllNotifications({ notifications, unread }: AllNotificationsProps) {
  const getComponent: any = (notification: any) => {
    const component = null;

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
    if (notification?.action === 'Invite') {
      return (
        <InviteNotification
          unread={!notification?.read_at}
          notification={notification}
          small
        />
      );
    }

    if (notification?.action === 'Follow') {
      return (
        <FollowNotification
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
          small
        />
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

    return component;
  };

  return (
    <React.Fragment>
      {notifications.map((notification) => {
        if (unread && notification?.read_at) {
          return null;
        }
        if (notification.action === 'Upvote' && notification.is_child) {
          return null;
        }
        return getComponent(notification);
      })}
    </React.Fragment>
  );
}

export default AllNotifications;
