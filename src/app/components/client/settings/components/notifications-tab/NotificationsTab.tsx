import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Button, Card, CardBody,
  Spinner,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { updateClientSettingsRequest } from '@reducers/auth/AuthAction';
import { handleError } from '@services/ErrorHandler';
import { SwitchButton } from '@shared/buttons/SwitchButton';
import useTranslation from '@shared/hooks/useTranslation';

import './NotificationsTab.scss';

function NotificationsTab() {
  const i18n = useTranslation('settings.notifications');
  const settings: any = useSelector((state: IRootState) => state.Auth.user.settings);
  const dispatch = useDispatch<any>();
  const [ data, setData ] = useState({
    'notification.receive_upvotes': settings['notification.receive_upvotes'] === 'true' || settings['notification.receive_upvotes'] === true,
    'notification.receive_activities_from_profile': settings['notification.receive_activities_from_profile'] === 'true' || settings['notification.receive_activities_from_profile'] === true,
    'notification.receive_desktop': settings['notification.receive_desktop'] === 'true' || settings['notification.receive_desktop'] === true,
  });
  const [ isLoading, setIsLoading ] = useState(false);

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setData((s) => ({
      ...s,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await dispatch(updateClientSettingsRequest(data)).$promise;
      toast.success(i18n.success.submit);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="notifications-tab pt-4">
      <Card className="mb-5">
        <CardBody>
          <h3 className="s3 text-primary mb-4">
            {i18n.label.general}
          </h3>

          <div className="d-flex align-items-center gap-3 mb-3 switch">
            <SwitchButton
              offLabel={i18n.label.off}
              activeLabel={i18n.label.on}
              onChange={({ target }) => handleInputChange({ target: { name: 'notification.receive_upvotes', value: !target.value } } as any)}
              isActive={!data['notification.receive_upvotes']}
            />
            <div className="b3 switch-label">
              {i18n.label.receiveActivityNotifications}
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 switch">
            <SwitchButton
              offLabel={i18n.label.off}
              activeLabel={i18n.label.on}
              onChange={({ target }) => handleInputChange({ target: { name: 'notification.receive_activities_from_profile', value: !target.value } } as any)}
              isActive={!data['notification.receive_activities_from_profile']}
            />
            <div className="b3 switch-label">
              {i18n.label.receiveFollowingNotifications}
            </div>
          </div>
        </CardBody>
      </Card>
      <Card className="mb-5">
        <CardBody>
          <h3 className="s3 text-primary mb-4">
            {i18n.label.desktopNotifications}
          </h3>

          <div className="d-flex align-items-center gap-3 switch">
            <SwitchButton
              offLabel={i18n.label.off}
              activeLabel={i18n.label.on}
              onChange={({ target }) => handleInputChange({ target: { name: 'notification.receive_desktop', value: !target.value } } as any)}
              isActive={!data['notification.receive_desktop']}
            />
            <div className="b3 switch-label">
              {i18n.label.receiveDesktopNotifications}
            </div>
          </div>
        </CardBody>
      </Card>

      <Button
        color="primary"
        block
        onClick={handleSubmit}
        className="action-button"
      >
        {isLoading && <Spinner size="sm" className="me-2" />}
        {i18n.button.saveChanges}
      </Button>
    </div>
  );
}

export default NotificationsTab;
