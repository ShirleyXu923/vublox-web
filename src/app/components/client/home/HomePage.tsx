import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Container, Nav, NavItem, NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import { clearUserTokenRequest } from '@reducers/auth/AuthAction';
import useCurrentLocation from '@shared/hooks/useCurrentLocation';
import useTranslation from '@shared/hooks/useTranslation';

import './HomePage.scss';
import DiscoverTab from './components/discover-tab/DiscoverTab';
import LiveEventsTab from './components/live-events-tab/LiveEventsTab';
import TrendingEventsTab from './components/trending-events-tab/TrendingEventsTab';
import UpcomingEventsTab from './components/upcoming-events-tab/UpcomingEventsTab';

function HomePage() {
  const dispatch = useDispatch<any>();
  const i18n = useTranslation('home');
  const [ activeTab, setActiveTab ] = useState('live');
  const { getLocation } = useCurrentLocation();
  const [ refresh, setRefresh ] = useState(false);
  const [ tabs, setTabs ] = useState<any>([ 'live' ]);

  const handleSetActiveTab = (tab: string) => {
    if (!tabs.includes(tab)) {
      setTabs((s: any) => [ ...s, tab ]);
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    if (!refresh) {
      getLocation();
      setRefresh(true);
    }

    const bc = new BroadcastChannel('vublox_channel');

    bc.onmessage = (event) => {
      if (event.data === 'logout') {
        dispatch(clearUserTokenRequest());

        bc.close();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid className="home-page">
      <Container className="px-0 px-md-5 py-4">
        <Nav pills className="nav-scrollable">
          <NavItem onClick={() => handleSetActiveTab('trending')}>
            <NavLink
              href="#"
              active={activeTab === 'trending'}
            >
              {i18n.label.trending}
            </NavLink>
          </NavItem>

          <NavItem onClick={() => handleSetActiveTab('live')}>
            <NavLink
              href="#"
              active={activeTab === 'live'}
            >
              {i18n.label.live}
            </NavLink>
          </NavItem>

          <NavItem onClick={() => handleSetActiveTab('discover')}>
            <NavLink
              href="#"
              active={activeTab === 'discover'}
            >
              {i18n.label.discover}
            </NavLink>
          </NavItem>

          <NavItem onClick={() => handleSetActiveTab('upcoming')}>
            <NavLink
              href="#"
              active={activeTab === 'upcoming'}
            >
              {i18n.label.upcoming}
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="trending">
            {tabs.includes('trending') && (
              <TrendingEventsTab />
            )}
          </TabPane>
          <TabPane tabId="live">
            <LiveEventsTab />
          </TabPane>
          <TabPane tabId="discover">
            {tabs.includes('discover') && (
              <DiscoverTab active={activeTab === 'discover'} />
            )}
          </TabPane>
          <TabPane tabId="upcoming">
            {tabs.includes('upcoming') && (
              <UpcomingEventsTab active={activeTab === 'upcoming'} />
            )}
          </TabPane>
        </TabContent>
      </Container>
    </Container>
  );
}

export default HomePage;
