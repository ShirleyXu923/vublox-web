import React, { useState } from 'react';
import {
  Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane,
} from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';

import './SettingsPage.scss';
import AccountTab from './components/account-tab/AccountTab';
import NotificationsTab from './components/notifications-tab/NotificationsTab';
import PasswordTab from './components/password-tab/PasswordTab';

function SettingsPage() {
  const i18n = useTranslation('settings');
  const [ activeTab, setActiveTab ] = useState<'account' | 'password' | 'notifications'>('account');

  return (
    <Container className="main-container settings-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={12} className="form-column">
            <h1>
              {i18n.label[`${activeTab}Settings`]}
            </h1>
            <Nav tabs className="mt-4 mb-3">
              <NavItem>
                <NavLink
                  active={activeTab === 'account'}
                  onClick={() => setActiveTab('account')}
                >
                  {i18n.button.account}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === 'password'}
                  onClick={() => setActiveTab('password')}
                >
                  {i18n.button.password}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === 'notifications'}
                  onClick={() => setActiveTab('notifications')}
                >
                  {i18n.button.notifications}
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="account">
                <AccountTab />
              </TabPane>
              <TabPane tabId="password">
                <PasswordTab />
              </TabPane>
              <TabPane tabId="notifications">
                <NotificationsTab />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default SettingsPage;
