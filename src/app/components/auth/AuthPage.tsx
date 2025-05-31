import React, { useState } from 'react';
import { useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import {
  Col, Container, Nav, NavItem, NavLink, Navbar, Row, TabContent, TabPane,
} from 'reactstrap';

import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';
import LanguageDropdown from '@shared/layout/dashboard/components/language-dropdown/LanguageDropdown';

import SignInPage from './sign-in/SignInPage';
import SignUpPage from './sign-up/SignUpPage';

import './AuthPage.scss';

function AuthPage() {
  const i18n = useTranslation('auth');
  const i18nHome = useTranslation('home');
  const location = useLocation();
  const [ activeTab, setActiveTab ] = useState(location.hash === '#signup' ? '1' : '0');
  const { logo } = useAppTheme();

  return (
    <div className="auth">
      <div className="accent left" />
      <div className="accent right" />

      <Navbar expand="md" className="top-nav" container="xl">
        <LanguageDropdown />
      </Navbar>

      <Container className="py-5">
        <Row className="justify-content-center py-5">
          <Col md={6}>
            <div className="text-center">
              <RouterNavLink to="/" className="link-home">
                <h2 className="text-primary fw-bold">
                  <img src={logo} alt="Vublox" height={30} /> <sup className="h6">{i18nHome.label.beta}</sup>
                </h2>
              </RouterNavLink>

              <Nav tabs className="justify-content-center mt-4 mb-3">
                <NavItem>
                  <NavLink
                    active={activeTab === '0'}
                    onClick={() => setActiveTab('0')}
                  >
                    {i18n.button.signIn}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={activeTab === '1'}
                    onClick={() => setActiveTab('1')}
                  >
                    {i18n.button.signUp}
                  </NavLink>
                </NavItem>
              </Nav>
            </div>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="0">
                <SignInPage />
              </TabPane>
              <TabPane tabId="1">
                <SignUpPage />
              </TabPane>
            </TabContent>

          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AuthPage;
