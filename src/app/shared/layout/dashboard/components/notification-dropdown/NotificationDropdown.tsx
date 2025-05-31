import './NotificationDropdown.scss';
import Pusher from 'pusher-js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  UncontrolledDropdown,
} from 'reactstrap';

import { IRootState } from '@app/store';
import notificationConfig from '@config/notification';
import { deleteNotificationsRequest, getNotificationsRequest } from '@reducers/auth/AuthAction';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';
import NotificationOutlineIcon from '@shared/icons/NotificationOutlineIcon';

import { AllNotifications } from './components/all-notifications';

function NotificationDropdown() {
  const i18n = useTranslation('notifications');
  const dispatch = useDispatch<any>();
  const {
    notifications,
    unreadNotifications,
    totalNotifications,
  } = useSelector((state: IRootState) => state.Auth);
  const user = useSelector((state: IRootState) => state.Auth.user);
  const [ activeTab, setActiveTab ] = useState('all');

  const loadNotifications = async () => {
    try {
      await dispatch(getNotificationsRequest()).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  const deleteNotifications = async () => {
    try {
      await dispatch(deleteNotificationsRequest()).$promise;
      await dispatch(getNotificationsRequest()).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  useEffect(() => {
    loadNotifications();

    const pusher = new Pusher(notificationConfig?.appKey, {
      cluster: notificationConfig?.appCluster,
    });

    const channel = pusher.subscribe('vublox-channel');
    channel.bind('vublox-event', (data: any) => {
      if (user?.id === data?.receiver_id) {
        loadNotifications();
      }
    });

    return () => {
      pusher.unsubscribe('vublox-channel');
      pusher.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="notification-dropdown-container">
      <UncontrolledDropdown>
        <DropdownToggle>
          <div className="badge bg-danger">
            <span className="a1">{unreadNotifications}</span>
          </div>
          <NotificationOutlineIcon height={22} width={20} />
        </DropdownToggle>
        <DropdownMenu>
          <div className="b3">{i18n.label.title}</div>
          <Nav pills>
            <NavItem href="#" onClick={() => setActiveTab('all')}>
              <NavLink active={activeTab === 'all'}>
                <span className={`${activeTab === 'all' ? 'tab-active' : 'caption1'}`}>{i18n.label.all}</span>
              </NavLink>
            </NavItem>
            <NavItem href="#" onClick={() => setActiveTab('unread')}>
              <NavLink active={activeTab === 'unread'}>
                <span className={`${activeTab === 'unread' ? 'tab-active' : 'caption1'}`}>{i18n.label.unread}</span>
              </NavLink>
            </NavItem>
            <NavItem href="#" className="delete-option" onClick={deleteNotifications}>
              <NavLink>
                <span className="caption1 text-danger">{i18n.label.clearAll}</span>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="all">
              {totalNotifications > 0
                ? (
                  <AllNotifications notifications={notifications} />
                )
                : (
                  <div className="text-center b5 my-3">
                    {i18n.label.noNotification}
                  </div>
                )}
            </TabPane>
            <TabPane tabId="unread">
              {unreadNotifications > 0
                ? (
                  <AllNotifications unread notifications={notifications} />
                )
                : (
                  <div className="text-center b5 my-3">
                    {i18n.label.noUnreadNotification}
                  </div>
                )}
            </TabPane>
          </TabContent>
          {totalNotifications > 0 && (
            <div className="view-all">
              <Link to="/notifications" className="view-all-link skip1">{i18n.label.viewAll}</Link>
            </div>
          )}
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
}

export default NotificationDropdown;
