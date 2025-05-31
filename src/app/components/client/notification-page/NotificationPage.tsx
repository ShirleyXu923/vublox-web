import './NotificationPage.scss';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { deleteNotificationsRequest, getNotificationsRequest } from '@reducers/auth/AuthAction';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';

import Notifications from './Notifications';

function NotificationPage() {
  const i18n = useTranslation('notifications');
  const dispatch = useDispatch<any>();
  const { notifications, unreadNotifications } = useSelector((state: IRootState) => state.Auth);
  const [ activeTab, setActiveTab ] = useState('all');

  const deleteNotifications = async () => {
    try {
      await dispatch(deleteNotificationsRequest()).$promise;
      await dispatch(getNotificationsRequest()).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  return (
    <Container fluid>
      <Container className="notification-page">
        <h1>{i18n.label.title}</h1>
        <Nav pills>
          <NavItem onClick={() => setActiveTab('all')}>
            <NavLink active={activeTab === 'all'}>
              <span className={`${activeTab === 'all' ? 'b6' : 'b5'}`}>{i18n.label.all}</span>
            </NavLink>
          </NavItem>
          <NavItem onClick={() => setActiveTab('unread')}>
            <NavLink active={activeTab === 'unread'}>
              <span className={`${activeTab === 'unread' ? 'b6' : 'b5'}`}>{i18n.label.unread}</span>
            </NavLink>
          </NavItem>
          <NavItem className="delete-option" onClick={deleteNotifications}>
            <NavLink>
              <span className="b5 text-danger">{i18n.label.clearAll}</span>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="all">
            {notifications?.length > 0
              ? (
                <Notifications notifications={notifications} />
              )
              : (
                <div className="text-center b5 mt-5">
                  {i18n.label.noNotification}
                </div>
              )}
          </TabPane>
          <TabPane tabId="unread">
            {unreadNotifications > 0
              ? (
                <Notifications unread notifications={notifications} />
              )
              : (
                <div className="text-center b5 mt-5">
                  {i18n.label.noUnreadNotification}
                </div>
              )}
          </TabPane>
        </TabContent>
      </Container>
    </Container>
  );
}

export default NotificationPage;
