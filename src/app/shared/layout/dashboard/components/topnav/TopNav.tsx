import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate, NavLink as RNavLink } from 'react-router-dom';
import {
  Button,
  Nav, Navbar, NavbarBrand, NavbarText,
  NavItem,
  NavLink,
  // NavItem,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { getOrganizationsRequest } from '@reducers/organization/OrganizationAction';
import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';
import { HomeIcon, WorldIcon } from '@shared/icons';

import AccountDropdown from '../account-dropdown/AccountDropdown';
// import Filter from '../filter/Filter';
// import Search from '../search/Search';
import CreateButton from '../create-button/CreateButton';
import './TopNav.scss';
import { NotificationDropdown } from '../notification-dropdown';
import Search from '../search/Search';

function TopNav() {
  const i18n = useTranslation('navbar');
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(({ Auth }: IRootState) => ({
    isLoggedIn: !!Auth.accessToken,
  }));
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });
  const { logo } = useAppTheme();
  const [ showSearch, setShowSearch ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);
  const dispatch = useDispatch<any>();

  const loadData = async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    const query = {
      owned: true,
    };

    await dispatch(getOrganizationsRequest(query)).$promise;

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showSearch && isSmScreen) {
    return (
      <Navbar expand="md" className="top-nav" container="xl" fixed="top">
        <Search toggle={() => setShowSearch(!showSearch)} isOpen />
      </Navbar>
    );
  }

  return (
    <Navbar expand="md" className="top-nav" container="xl" fixed="top">
      <NavbarBrand tag={RNavLink} to="/">
        <h3 className="text-primary fw-bold mb-0">
          <img src={logo} alt="Vublox" height={30} />
        </h3>
      </NavbarBrand>

      <NavItem className="ms-4">
        <NavLink tag={RNavLink} to="/home">
          <HomeIcon />
          <span className="d-none d-md-inline">
            {i18n.label.home}
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={RNavLink} to="/world-events">
          <WorldIcon />
          <span className="d-none d-md-inline">
            {i18n.label.worldEvents}
          </span>
        </NavLink>
      </NavItem>
      <Nav className="me-auto" navbar />

      <NavItem>
        <Search toggle={() => setShowSearch(!showSearch)} isOpen={showSearch} />
      </NavItem>

      {/* {isLoggedIn && (
        <NavItem>
          <Filter />
        </NavItem>
      )} */}

      {isLoggedIn ? (
        <>
          <NavItem>
            <NotificationDropdown />
          </NavItem>
          <NavItem>
            <CreateButton />
          </NavItem>
          <AccountDropdown isLoading={isLoading} />
        </>
      ) : (
        <>
          <NavbarText>
            <Button
              size="sm"
              color={isSmScreen ? 'primary' : 'tertiary'}
              className={classNames({
                'px-4': true,
                'me-2 text-primary': !isSmScreen,
              })}
              onClick={() => navigate('/auth')}
            >
              {i18n.button.signIn}
            </Button>
          </NavbarText>
          {!isSmScreen && (
            <NavbarText>
              <Button
                size="sm"
                color="primary"
                className="px-4"
                onClick={() => navigate('/auth#signup')}
              >
                {i18n.button.signUp}
              </Button>
            </NavbarText>
          )}
        </>
      )}
    </Navbar>
  );
}

export default TopNav;
