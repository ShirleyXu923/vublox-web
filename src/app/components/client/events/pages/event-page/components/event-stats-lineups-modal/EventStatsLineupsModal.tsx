import { padStart } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { NavLink as RNavLink } from 'react-router-dom';
import {
  Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink,
  Progress,
  TabContent,
  TabPane,
} from 'reactstrap';

import { getEventStatisticsRequest } from '@reducers/event/EventAction';
import { handleError } from '@services/ErrorHandler';
import { getProfileLink } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { BallIcon, CardIcon, SubstitutionIcon } from '@shared/icons';

import './EventStatsLineupsModal.scss';
import EventLineupsPlaceholder from './EventLineupsPlaceholder';
import EventStatsPlaceholder from './EventStatsPlaceholder';

function EventStatsLineupsModal({ event, show, toggle }: {
  event: any;
  show: boolean;
  toggle: () => void;
}) {
  const i18n = useTranslation('eventPage');
  const [ activeTab, setActiveTab ] = React.useState('statistics');
  const [ loading, setLoading ] = React.useState(event.lineups?.home?.length !== 0
    && event.lineups?.away?.length !== 0);
  const [ stats ] = useState({
    'ball-possession': i18n.label.ballPossession,
    'shots-total': i18n.label.totalShots,
    'shots-on-target': i18n.label.shotsOnGoal,
    passes: i18n.label.totalPasses,
    'successful-passes-percentage': i18n.label.passAccuracy,
    yellowcards: i18n.label.yellowcards,
    redcards: i18n.label.redcards,
    corners: i18n.label.corners,
    fouls: i18n.label.fouls,
    offsides: i18n.label.offsides,
    saves: i18n.label.saves,
  });
  const { statistics = {} } = event?.metadata || {};
  const { lineups = [] } = event;
  const dispatch = useDispatch<any>();
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });

  const loadData = async () => {
    if (event.lineups?.home?.length > 0 && event.lineups?.away?.length > 0) {
      return;
    }

    try {
      await dispatch(getEventStatisticsRequest(event.id)).$promise;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const renderLineup = (lineup: any, type: string) => (
    <div key={lineup.id} className="lineup">
      <span>
        <div className="icons">
          {type === 'away' && (
            <RNavLink to={getProfileLink(lineup.player)} target="_blank">
              {lineup.player?.display_name}
            </RNavLink>
          )}
          {lineup.data?.goals > 0 && (
            <BallIcon className="ball-icon" width={14} />
          )}
          {lineup.data?.substitutions > 0 && (
            <SubstitutionIcon />
          )}
          {lineup.data?.yellowcards > 0 && (
            <CardIcon />
          )}
          {lineup.data?.redcards > 0 && (
            <CardIcon fill="var(--bs-danger)" />
          )}
        </div>
        {type === 'home' && (
          <RNavLink to={getProfileLink(lineup.player)} target="_blank">
            {lineup.player?.display_name}
          </RNavLink>
        )}
      </span>
      <span className="jersey-number">
        {padStart(lineup.data?.jersey_number, 2, '0')}
      </span>
    </div>
  );

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ event.id ]);

  return (
    <Modal
      isOpen={show}
      toggle={toggle}
      centered
      className="event-stats-lineups-modal"
    >
      <ModalHeader toggle={toggle}>
        <h2 className="s1 p-2 mb-0">
          {activeTab !== 'statistics' ? i18n.label.viewLineups : i18n.label.viewStatistics}
        </h2>
      </ModalHeader>
      <ModalBody>
        <Nav pills>
          <NavItem onClick={() => setActiveTab('statistics')}>
            <NavLink active={activeTab === 'statistics'}>
              {i18n.label.statistics}
            </NavLink>
          </NavItem>

          {isSmScreen ? (
            <>
              <NavItem onClick={() => setActiveTab('team1')}>
                <NavLink active={activeTab === 'team1'}>
                  {event.homeTeam?.name}
                </NavLink>
              </NavItem>

              <NavItem onClick={() => setActiveTab('team2')}>
                <NavLink active={activeTab === 'team2'}>
                  {event.awayTeam?.name}
                </NavLink>
              </NavItem>
            </>
          ) : (
            <NavItem onClick={() => setActiveTab('lineups')}>
              <NavLink active={activeTab === 'lineups'}>
                {i18n.label.lineups}
              </NavLink>
            </NavItem>
          )}
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="statistics" className="statistics">
            <div className="teams">
              <div className="team">
                <img src={event.homeTeam?.logo?.sm} alt={event.homeTeam?.name} />
                <div>
                  {event.homeTeam?.name}
                </div>
              </div>

              <div className="line" />
              <div className="team">
                <img src={event.awayTeam?.logo?.sm} alt={event.awayTeam?.name} />
                <div>
                  {event.awayTeam?.name}
                </div>
              </div>
            </div>

            {loading ? <EventStatsPlaceholder /> : (
              <>
                {Object.keys(stats).map((key) => (
                  <div className="stats" key={key}>
                    <div className="title">
                      {(stats as any)[key]}
                    </div>

                    <div className="stats-item">
                      <div className="stats-value">
                        {statistics[key]?.home || 0}{(key === 'ball-possession' || key === 'successful-passes-percentage') && '%'}
                      </div>

                      <Progress
                        value={(+(statistics[key]?.home || 0)
                      / (+(statistics[key]?.home || 0) + +(statistics[key]?.away || 0))) * 100}
                      />

                      <div className="stats-value">
                        {statistics[key]?.away || 0}{(key === 'ball-possession' || key === 'successful-passes-percentage') && '%'}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </TabPane>
          <TabPane tabId="lineups">
            <div className="lineups">
              <div className="teams">
                <div className="team">
                  <img src={event.homeTeam?.logo?.sm} alt={event.homeTeam?.name} />
                  <div>
                    {event.homeTeam?.name}
                  </div>
                </div>

                <div className="line" />
                <div className="team">
                  <img src={event.awayTeam?.logo?.sm} alt={event.awayTeam?.name} />
                  <div>
                    {event.awayTeam?.name}
                  </div>
                </div>
              </div>
            </div>

            {loading ? <EventLineupsPlaceholder /> : (
              <>
                <div className="lineups-title">
                  {i18n.label.lineup}
                </div>

                <div className="lineups">
                  <div className="lineup-team">
                    {lineups.home?.lineup?.map((lineup: any) => renderLineup(lineup, 'home'))}
                  </div>
                  <div className="lineup-team">
                    {lineups.away?.lineup?.map((lineup: any) => renderLineup(lineup, 'away'))}
                  </div>
                </div>

                {lineups.home?.lineup?.length === 0 && lineups.away?.lineup?.length === 0 && (
                  <div className="text-center mb-4">
                    {i18n.label.emptyLineup}
                  </div>
                )}

                <div className="lineups-title">
                  {i18n.label.bench}
                </div>

                <div className="lineups">
                  <div className="lineup-team">
                    {lineups.home?.bench?.map((lineup: any) => renderLineup(lineup, 'home'))}
                  </div>
                  <div className="lineup-team">
                    {lineups.away?.bench?.map((lineup: any) => renderLineup(lineup, 'away'))}
                  </div>
                </div>

                {lineups.home?.bench?.length === 0 && lineups.away?.bench?.length === 0 && (
                  <div className="text-center mb-4">
                    {i18n.label.emptyLineup}
                  </div>
                )}
              </>
            )}
          </TabPane>

          {isSmScreen && (
            <>
              <TabPane tabId="team1">
                <div className="team">
                  <img src={event.homeTeam?.logo?.sm} alt={event.homeTeam?.name} />
                  <div>
                    {event.homeTeam?.name}
                  </div>
                </div>

                <div className="lineups-title">
                  {i18n.label.lineup}
                </div>

                <div className="lineups">
                  <div className="lineup-team">
                    {lineups.home?.lineup?.map((lineup: any) => renderLineup(lineup, 'away'))}
                  </div>
                </div>

                {lineups.home?.lineup?.length === 0 && lineups.away?.lineup?.length === 0 && (
                  <div className="text-center mb-4">
                    {i18n.label.emptyLineup}
                  </div>
                )}

                <div className="lineups-title">
                  {i18n.label.bench}
                </div>

                <div className="lineups">
                  <div className="lineup-team">
                    {lineups.home?.bench?.map((lineup: any) => renderLineup(lineup, 'away'))}
                  </div>
                </div>
              </TabPane>

              {/* Team 2 */}
              <TabPane tabId="team2">
                <div className="team">
                  <img src={event.awayTeam?.logo?.sm} alt={event.awayTeam?.name} />
                  <div>
                    {event.awayTeam?.name}
                  </div>
                </div>

                <div className="lineups-title">
                  {i18n.label.lineup}
                </div>

                <div className="lineups">
                  <div className="lineup-team">
                    {lineups.away?.lineup?.map((lineup: any) => renderLineup(lineup, 'away'))}
                  </div>
                </div>

                {lineups.home?.lineup?.length === 0 && lineups.away?.lineup?.length === 0 && (
                  <div className="text-center mb-4">
                    {i18n.label.emptyLineup}
                  </div>
                )}

                <div className="lineups-title">
                  {i18n.label.bench}
                </div>

                <div className="lineups">
                  <div className="lineup-team">
                    {lineups.away?.bench?.map((lineup: any) => renderLineup(lineup, 'away'))}
                  </div>
                </div>
              </TabPane>
            </>
          )}
        </TabContent>
      </ModalBody>
    </Modal>
  );
}

export default EventStatsLineupsModal;
