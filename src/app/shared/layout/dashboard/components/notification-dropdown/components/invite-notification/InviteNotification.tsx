import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { readNotificationRequest, getNotificationsRequest } from '@reducers/auth/AuthAction';
import { acceptInvite, declineInvite } from '@reducers/event/EventAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { Button } from '@shared/buttons/Button';
import { shortedFromNow } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { CloseIcon, InviteNotifIcon } from '@shared/icons';
import CheckIcon from '@shared/icons/CheckIcon';
import Avatar from '@shared/utils/Avatar/Avatar';

import './InviteNotification.scss';

interface ShareNotificationProps {
  unread?: boolean;
  notification: any;
  small?: boolean;
}

function InviteNotification({ unread, notification, small = false }: ShareNotificationProps) {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const i18n = useTranslation('notifications');
  const [ inviteState, setInviteState ] = useState({
    isUserAccepted: false,
    isUserDeclined: false,
  });

  const getLink = () => `/events/${notification?.invite?.event_id}`;

  const readNotification = async () => {
    try {
      await dispatch(readNotificationRequest(notification?.id)).$promise;
      navigate(getLink());
      await dispatch(getNotificationsRequest()).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  const onAccept = async () => {
    await dispatch(acceptInvite(notification.invite?.event_id, notification?.invite?.id));
    setInviteState((prev) => ({
      ...prev,
      isUserAccepted: true,
      isUserDeclined: false,
    }));
    readNotification();
  };
  const onDecline = async () => {
    await dispatch(declineInvite(notification.invite?.event_id, notification?.invite?.id));

    setInviteState((prev) => ({
      ...prev,
      isUserAccepted: false,
      isUserDeclined: true,
    }));

    readNotification();
  };

  useEffect(() => {
    if (notification?.invite) {
      setInviteState({
        isUserDeclined: notification?.invite?.status === 'declined',
        isUserAccepted: notification?.invite?.status === 'accepted',
      });
    }
  }, [ notification ]);

  return (
    <div className={`invitation-notification notification-item ${unread ? 'unread' : ''}`}>
      <div className={`wrapper ${unread ? 'unread' : ''}`}>
        {inviteState.isUserDeclined && (
          <>
            <Link to={getLink()} onClick={readNotification} className="logo">
              <Avatar
                user={notification?.sender}
                svg={
                  <InviteNotifIcon height={`${small ? '35' : '52'}`} width={`${small ? '35' : '52'}`} decline noBorder />
                }
                size="md"
              />
            </Link>
            <div className="data">
              <div className="message">
                <div>
                  {LocaleService.parseTranslation(i18n.label.eventMessage, {
                    action: (
                      <strong>{i18n.label.declined}</strong>
                    ),
                    event: (
                      <strong className="truncate">{notification?.invite?.event_name}</strong>
                    ),
                  })}
                  <div className="b5 time">
                    <span className="dot">•</span>
                    {shortedFromNow(notification?.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {inviteState.isUserAccepted && (
          <>
            <Link to={getLink()} onClick={readNotification} className="logo">
              <Avatar user={notification?.sender} svg={<InviteNotifIcon height={`${small ? '35' : '52'}`} width={`${small ? '35' : '52'}`} noBorder />} size="md" />
            </Link>
            <div className="data">
              <div className="message">
                <div>
                  {LocaleService.parseTranslation(i18n.label.eventMessage, {
                    action: (
                      <strong>{i18n.label.accepted}</strong>
                    ),
                    event: (
                      <strong className="truncate">{notification?.invite?.event_name}</strong>
                    ),
                  })}
                  <div className="b5 time">
                    <span className="dot">•</span>
                    {shortedFromNow(notification?.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {(!inviteState.isUserDeclined && !inviteState.isUserAccepted) && (
          <>
            <Link to={getLink()} onClick={readNotification} className="logo">
              <Avatar user={notification?.sender} size="md" />
              <div className="icon">
                <InviteNotifIcon />
              </div>
            </Link>
            <div className="data">
              <div className="title">
                <div className="b6">
                  {notification?.sender?.name || notification?.sender?.display_name}
                </div>
              </div>
              <div className={`message ${small && 'small'}`}>
                <div className="b5">
                  {LocaleService.parseTranslation(i18n.label.invitedYouTo, {
                    event: (
                      <strong className="truncate">{notification?.invite?.event_name}</strong>
                    ),
                  })}
                </div>
                <div className={`${small && 'd-flex align-items-center'}`}>
                  <span className="dot">•</span>
                  <div className="b5 time">{shortedFromNow(notification?.created_at)}</div>
                </div>
              </div>
              <div className="time-and-actions">
                <div className="actions">
                  <Button
                    onClick={onAccept}
                    label={i18n.label.accept}
                    color="primary"
                    outline
                    icon={<CheckIcon />}
                  />
                  <Button
                    onClick={onDecline}
                    label={i18n.label.decline}
                    className="decline-button r-button"
                    color="danger"
                    outline
                    icon={<CloseIcon />}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InviteNotification;
