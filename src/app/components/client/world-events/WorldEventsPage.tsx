import classNames from 'classnames';
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  Col,
  Container, Nav, NavItem, NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';

import AdvancedFilter from '@shared/components/AdvancedFilter/AdvancedFilter';
import LocationFilter from '@shared/components/LocationFilter/LocationFilter';
import useTranslation from '@shared/hooks/useTranslation';

import WorldMapContent from './components/world-map-content/WorldMapContent';

import './WorldEventsPage.scss';

function WorldEventsPage() {
  const i18n = useTranslation('worldEvents');
  const [ activeTab, setActiveTab ] = useState('live');
  const [ locations, setLocations ] = useState<any>({});
  const [ tabs, setTabs ] = useState<any>([ 'live' ]);
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });

  const handleSetLocations = (location: any) => {
    setLocations((s: any) => ({
      ...s,
      [activeTab]: location,
    }));
  };

  const handleSetActiveTab = (tab: string) => {
    if (!tabs.includes(tab)) {
      setTabs((s: any) => [ ...s, tab ]);
    }

    setActiveTab(tab);
  };

  return (
    <div className="world-events-page">
      <Container className="px-md-5 pt-4" fluid>
        <Container className="container2 world-event-pills">
          <Row>
            <Col lg={8} className="mb-4 mb-md-2">
              <Nav pills className="nav-scrollable">
                <NavItem onClick={() => handleSetActiveTab('trending')}>
                  <NavLink href="#" active={activeTab === 'trending'}>
                    {i18n.label.trending}
                  </NavLink>
                </NavItem>
                <NavItem onClick={() => handleSetActiveTab('past')}>
                  <NavLink href="#" active={activeTab === 'past'}>
                    {i18n.label.past}
                  </NavLink>
                </NavItem>
                <NavItem onClick={() => handleSetActiveTab('live')}>
                  <NavLink href="#" active={activeTab === 'live'}>
                    {i18n.label.live}
                  </NavLink>
                </NavItem>
                <NavItem onClick={() => handleSetActiveTab('discover')}>
                  <NavLink href="#" active={activeTab === 'discover'}>
                    {i18n.label.discover}
                  </NavLink>
                </NavItem>
                <NavItem onClick={() => handleSetActiveTab('upcoming')}>
                  <NavLink href="#" active={activeTab === 'upcoming'}>
                    {i18n.label.upcoming}
                  </NavLink>
                </NavItem>
              </Nav>
            </Col>

            <Col
              xl={4}
            >
              <div
                className={classNames('d-flex justify-content-lg-start justify-content-md-start justify-content-center gap-2', {
                  'no-wrap': isSmScreen,
                  'd-none': activeTab === 'trending' || activeTab === 'discover',
                })}
              >
                <AdvancedFilter
                  upcoming={activeTab === 'upcoming'}
                  inverse={activeTab === 'discover'}
                />
                <LocationFilter
                  handleSetLocation={handleSetLocations}
                  end
                />
              </div>
            </Col>
          </Row>
        </Container>
      </Container>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="trending" key="trending">
          {tabs.includes('trending') && (
            <WorldMapContent
              params={{
                filter: 'trending',
              }}
              mapId="trending"
              location={locations.trending}
            />
          )}
        </TabPane>
        <TabPane tabId="past">
          {tabs.includes('past') && (
            <WorldMapContent
              defaultTimescale="1-mo"
              params={{
                type: 'past',
              }}
              mapId="past"
              location={locations.past}
            />
          )}
        </TabPane>
        <TabPane tabId="live">
          <WorldMapContent
            defaultTimescale="1-h"
            params={{
              type: 'live',
            }}
            mapId="live"
            location={locations.live}
          />
        </TabPane>
        <TabPane tabId="discover">
          {tabs.includes('discover') && (
            <WorldMapContent
              defaultTimescale="1-mo"
              mapId="discover"
              params={{
                type: 'discover',
              }}
              location={locations.discover}
            />
          )}
        </TabPane>
        <TabPane tabId="upcoming">
          {tabs.includes('upcoming') && (
            <WorldMapContent
              defaultSort="oldest-to-latest"
              defaultTimescale="1-mo"
              mapId="upcoming"
              params={{
                type: 'upcoming',
              }}
              location={locations.upcoming}
            />
          )}
        </TabPane>

      </TabContent>
    </div>
  );
}

export default WorldEventsPage;
