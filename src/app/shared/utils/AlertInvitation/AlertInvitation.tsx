import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getNotificationsRequest } from '@reducers/auth/AuthAction';
import { acceptInvite, declineInvite } from '@reducers/event/EventAction';
import LocaleService from '@services/LocaleService';
import { Button } from '@shared/buttons/Button';
import { CloseIcon } from '@shared/icons';
import CheckIcon from '@shared/icons/CheckIcon';

import './AlertInvitation.scss';

interface AlertProps {
  icon?: React.ReactNode;
  hasMaxWidth?: boolean;
  className?: string;
  event: any;
}

function AlertInvitation({
  icon, hasMaxWidth, className, event,
}: AlertProps) {
  const i18n = LocaleService.getTranslations('timelinePage');
  const dispatch = useDispatch<any>();
  const [ inviteState, setInviteState ] = useState({
    isUserAccepted: false,
    isUserDeclined: false,
  });

  const onAccept = async () => {
    await dispatch(acceptInvite(event.invite?.event_id, event?.invite?.id));
    await dispatch(getNotificationsRequest()).$promise;
    setInviteState((prev) => ({
      ...prev,
      isUserAccepted: true,
      isUserDeclined: false,
    }));
  };
  const onDecline = async () => {
    await dispatch(declineInvite(event.invite?.event_id, event?.invite?.id));
    await dispatch(getNotificationsRequest()).$promise;
    setInviteState((prev) => ({
      ...prev,
      isUserAccepted: false,
      isUserDeclined: true,
    }));
  };

  useEffect(() => {
    if (event?.invite) {
      setInviteState({
        isUserDeclined: event?.invite?.status === 'declined',
        isUserAccepted: event?.invite?.status === 'accepted',
      });
    }
  }, [ event ]);

  return (
    <div className={classNames('alert-notif flex my-4', className)}>
      <div className="content">
        {icon}
        {inviteState.isUserDeclined && (
          <span className={`b5 ${hasMaxWidth ? 'max-width' : ''}`}>
            {i18n.label.declinedInvite}
          </span>
        )}

        {inviteState.isUserAccepted && (
          <span className={`b5 ${hasMaxWidth ? 'max-width' : ''}`}>
            {i18n.label.acceptedInvite}
          </span>
        )}

        {(!inviteState.isUserDeclined && !inviteState.isUserAccepted) && (
          <span className={`b5 ${hasMaxWidth ? 'max-width' : ''}`}>
            {i18n.label.userInvited}
          </span>
        )}
      </div>
      {(!inviteState.isUserDeclined && !inviteState.isUserAccepted) && (
        <div className="actions">
          <Button
            onClick={onAccept}
            label={i18n.label.accept}
            color="primary"
            icon={<CheckIcon />}
          />
          <Button
            onClick={onDecline}
            label={i18n.label.decline}
            className="decline-button r-button"
            color="danger"
            icon={<CloseIcon />}
          />
        </div>
      )}
    </div>
  );
}

export default AlertInvitation;
