import classNames from 'classnames';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container, Nav, NavItem, NavLink,
} from 'reactstrap';

import { IRootState } from '@app/store';
import PrivateTimeline from '@components/client/timelines/pages/timeline-page/components/PrivateTimeline';
import { getEventRequest, getEventTimelineRequest } from '@reducers/event/EventAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { AccordionTimeline } from '@shared/components/AccordionTimeline';
import PreviewTimeline from '@shared/components/AccordionTimeline/components/timeline/PreviewTimeline';
import ResizableTimeline from '@shared/components/ResizableTimeline/ResizableTimeline';
import useDeepEffect from '@shared/hooks/useDeepEffect';
import usePrevious from '@shared/hooks/usePrevious';
import TopNav from '@shared/layout/dashboard/components/topnav/TopNav';

import EventPagePlaceholder from '../../EventPagePlaceholder';
import { EventHeader } from '../event-header';
import EventStadium from '../event-stadium/EventStadium';

import '../../EventPage.scss';

function EventContent({
  id, preview, defaultItem, TimelineMapComponent, TimelineComponent,
}:
{ id?: string; preview?: boolean; defaultItem?: any; TimelineMapComponent: FC<any>;
  TimelineComponent: FC<any> }) {
  const i18n = LocaleService.getTranslations('eventPage');
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const e = useSelector((state: IRootState) => state.Event.event);
  const [ event, setEvent ] = useState(defaultItem || e);
  const user = useSelector((state: IRootState) => state.Auth.user);
  const account = useSelector((state: IRootState) => state.Auth.account);
  const gameMode = !!event.game_mode;
  const [ scroll, setScroll ] = useState(0);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ queryParams, setQueryParams ] = useState({ id });
  const [ locations, setLocations ] = useState<any[]>([]);
  const [ startDate, setStartDate ] = useState<Date | string>('');
  const [ endDate, setEndDate ] = useState<Date | string>('');
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const location = useLocation();
  const previousEvent = usePrevious(event);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await dispatch(getEventRequest(id ?? '')).$promise;
    } catch (err) {
      handleError(err, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const TabIds = {
    TIMELINE: i18n.label.timeline,
    REWARDS_CENTER: i18n.label.rewardsCenter,

  } as const;

  const tabs = [
    { id: TabIds.TIMELINE, label: i18n.label.timeline },
    { id: TabIds.REWARDS_CENTER, label: i18n.label.rewardsCenter },

  ];
  const [ activeTab, setActiveTab ] = useState<typeof TabIds[keyof typeof TabIds]>(TabIds.TIMELINE);

  const handleApplyFilters = (filters = {}) => {
    setQueryParams(s => ({
      ...s,
      ...filters,
    }));
  };

  const handleSetLocations = (items: any[]) => {
    if (items?.length === 0) return;
    setLocations(items.filter(i => i.type === 'Group')[0]?.items?.map?.((i: any) => ({ ...i.data, page_type: i.type }))
      ?.filter((i: any) => i.location?.latitude
    && i.location?.longitude) || []);
    setStartDate(sd => {
      const newDate = items?.[items.length - 1]?.started_at;
      return !sd || moment(newDate).isBefore(moment(sd)) ? newDate : sd;
    });
    setEndDate(sd => {
      const newDate = items?.[0]?.started_at;
      return !sd || moment(newDate).isAfter(moment(sd)) ? newDate : sd;
    });
  };

  const handleSetVisibleLocations = (isVisible: boolean, items: any[] = []) => {
    if (!isVisible) return;
    setLocations(items.map((i: any) => ({ ...i.data, page_type: i.type }))
      .filter((i: any) => i.location?.latitude
      && i.location?.longitude) || []);
  };

  const isCoCreator = () => event?.coCreators?.some(
    (item: any) => item?.creator?.id === account?.id);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ location ]);

  useDeepEffect(() => {
    if (previousEvent?.id && previousEvent.id === event.id
      && previousEvent.updated_at !== event.updated_at) {
      setQueryParams(s => ({ ...s, key: Math.random() }));
    }
  }, [ event, previousEvent ]);

  useEffect(() => {
    setEvent(e);
  }, [ e ]);

  return (
    <>
      {!preview && (
        <div className={classNames(`top-navigation mb-4 ${scroll === 0 || !gameMode ? 'top' : 'scrolled'}`)}>
          <TopNav />
        </div>
      )}
      {isLoading
        ? (
          <Container className="event-page-placeholder">
            <EventPagePlaceholder />
          </Container>
        )
        : (
          <Container className={classNames('event-page-wrapper', { 'game-mode': gameMode })} fluid>
            <EventHeader
              event={event}
              gameMode={gameMode}
              isOwner={event?.created_by === user?.id}
            />

            {/* For non-game mode, show pills and render Accordion based on activeTab */}
            {!gameMode && (
              <div className="scrolling-pills-timeline d-flex overflow-auto gap-2 mt-4 mb-4 event-page-not-game-mode">
                <Nav pills className="flex-nowrap gap-2">
                  {tabs.map(tab => (
                    <NavItem key={tab.id}>
                      <NavLink
                        active={activeTab === tab.id}
                        className="tab-link text-nowrap d-flex justify-content-center align-items-center"
                        onClick={() => setActiveTab(tab.id)}
                        aria-label={`${tab.label} tab`}
                        style={{ cursor: 'pointer' }}
                      >
                        {tab.label}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </div>
            )}

            {/* Rewards Center Tab */}
            {activeTab === TabIds.REWARDS_CENTER && (
              <h3 className="d-flex justify-content-center align-items-center mt-5">{i18n.label.upcoming}</h3>
            )}

            <div className="mt-3" />
            <ResizableTimeline
              mapComponent={gameMode ? (
                <EventStadium
                  locations={locations}
                  event={event}
                  endDate={endDate}
                  reload={handleApplyFilters}
                  preview={preview}
                />
              ) : (
                <TimelineMapComponent
                  markers={locations}
                  startDate={startDate}
                  endDate={endDate}
                  location={event.location}
                  loading={isLoading}
                  onSelectTimeRange={(data: any) => setQueryParams((s: any) => ({ ...s, ...data }))}
                />
              )}
              timeline={activeTab === TabIds.TIMELINE ? (
              // eslint-disable-next-line react/jsx-no-useless-fragment
                <>
                  {
                    event?.privacy_option === 'public'
                      || event?.created_by === user?.id
                      || isCoCreator()
                      || (event?.invite?.status === 'accepted' && event?.invite?.invited_id === user?.id) ? (
                        <AccordionTimeline
                          createEventLink={`/events/create?eventable_id=${id}&eventable_type=Event#step-1`}
                          createTimelineLink={`/timelines/create?timelineable_id=${id}&timelineable_type=Event`}
                          hideContributePost={event.type === 'upcoming'}
                          secondsTimescale
                          createPostLink={`/posts/create?postable_id=${event?.id}&postable_type=Event#step-1`}
                          showFiltersOnly={isXsScreen && gameMode}
                          request={getEventTimelineRequest}
                          query={queryParams}
                          onChangeTimeline={handleSetLocations}
                          onChangeVisibleItems={handleSetVisibleLocations}
                          onChangeDates={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);
                          }}
                          gameMode={gameMode}
                          defaultTimescale={gameMode ? '5-min' : '30-min'}
                          defaultSort={event.type === 'past' ? 'oldest-to-latest' : 'latest-to-oldest'}
                          link={`/events/${id}`}
                          preview={preview}
                          TimelineComponent={preview ? PreviewTimeline : TimelineComponent}
                        />
                      ) : (
                        <PrivateTimeline eventData={event} />

                      )
                  }
                </>
              ) : null}
            />
          </Container>
        )}

    </>
  );
}

export default EventContent;
