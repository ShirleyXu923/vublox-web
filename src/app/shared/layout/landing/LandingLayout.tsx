import React from 'react';
import { useSelector } from 'react-redux';
import {
  Outlet, useNavigate, NavLink as RNavLink,
  Navigate,
} from 'react-router-dom';
import {
  Button, Container, Nav, Navbar, NavbarBrand, NavbarText, NavLink,
} from 'reactstrap';

import app from '@config/app';
import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';
import { SocialFacebookIcon, SocialInstagramIcon } from '@shared/icons';

import Copyright from './components/Copyright';

import './LandingLayout.scss';

function LandingLayout() {
  const i18n = useTranslation('landing');
  const navigate = useNavigate();
  const { logo } = useAppTheme();
  const isLoggedIn = useSelector(({ Auth }) => !!Auth.accessToken);

  if (isLoggedIn && window.location.pathname === '/') {
    return <Navigate to="/world-events" replace />;
  }

  return (
    <Container fluid className="landing-layout g-0">
      <Navbar expand="md" className="top-nav" container="xl" fixed="top">
        <NavbarBrand tag={RNavLink} to="/">
          <h3 className="text-primary fw-bold mb-0">
            <img src={logo} alt="Vublox" height={30} />
          </h3>
        </NavbarBrand>
        <Nav className="me-auto" navbar />
        <NavbarText>
          <Button
            size="sm"
            color="primary"
            className="px-4"
            onClick={() => navigate('/world-events')}
          >
            {i18n.button.tryBetaNow}
          </Button>
        </NavbarText>
      </Navbar>

      <Outlet />

      <Navbar expand="md" container="xl" className="footer">
        <div className="footer-container">
          {/* Mobile layout - top row */}
          <div className="footer-mobile-top d-md-none">
            <Copyright />

            {/* Social Icons */}
            <div className="footer-social">
              <NavLink
                className="social-link"
                href="https://www.facebook.com/profile.php?id=61560661919902"
                target="_blank"
              >
                <SocialFacebookIcon width="18" height="18" />
              </NavLink>
              <NavLink
                className="social-link"
                href="https://www.instagram.com/vubloxofficial"
                target="_blank"
              >
                <SocialInstagramIcon width="20" height="20" />
              </NavLink>
            </div>
          </div>

          {/* Desktop layout - left side */}
          <div className="footer-left d-none d-md-flex">
            <Copyright />

            <div className="footer-divider" />

            {/* Social Icons */}
            <div className="footer-social">
              <NavLink
                className="social-link"
                href="https://www.facebook.com/profile.php?id=61560661919902"
                target="_blank"
              >
                <SocialFacebookIcon width="18" height="18" />
              </NavLink>
              <NavLink
                className="social-link"
                href="https://www.instagram.com/vubloxofficial"
                target="_blank"
              >
                <SocialInstagramIcon width="20" height="20" />
              </NavLink>
            </div>
          </div>

          {/* Horizontal divider for mobile */}
          <div className="mobile-horizontal-divider d-md-none" />

          {/* Footer links - different layout on mobile */}
          <Nav className="footer-nav" navbar>
            <NavLink href={`mailto:${app.contactEmail}`} className="footer-link">
              {i18n.button.contactUs}
            </NavLink>

            <div className="footer-divider mobile-divider d-none d-md-block d-md-block" />

            <RNavLink to="/privacy-policy" className="nav-link footer-link">
              {i18n.button.privacyPolicy}
            </RNavLink>

            <div className="footer-divider mobile-divider d-none d-md-block" />

            <RNavLink to="/terms-and-conditions" className="nav-link footer-link">
              {i18n.button.termsAndConditions}
            </RNavLink>

            <div className="footer-divider mobile-divider d-none d-md-block" />

            <RNavLink to="/cookie-policy" className="nav-link footer-link">
              {i18n.button.cookiePolicy}
            </RNavLink>
          </Nav>
        </div>
      </Navbar>
    </Container>
  );
}

export default LandingLayout;
