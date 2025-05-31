import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  useLocation, useNavigate, useParams, useSearchParams,
} from 'react-router-dom';
import { Container } from 'reactstrap';

import { getProfileTimelineRequest } from '@reducers/auth/AuthAction';
import { getEventRequest, getEventTimelineRequest } from '@reducers/event/EventAction';
import { getLocationRequest, getLocationTimelineRequest } from '@reducers/location/LocationAction';
import { getOrganizationRequest, getOrganizationTimelineRequest } from '@reducers/organization/OrganizationAction';
import { getTimelineRequest, getTimelineTimelineRequest, getWorldTimelineRequest } from '@reducers/timeline/TimelineActions';
import { getProfileRequest } from '@reducers/user-profile/UserProfileAction';
import { handleError } from '@services/ErrorHandler';
import ResizableTimeline from '@shared/components/ResizableTimeline/ResizableTimeline';
import TimeblocksView from '@shared/components/TimeblocksView/TimeblocksView';
import TimelineMap from '@shared/components/TimelineMap/TimelineMap';
import useTimelineMap from '@shared/hooks/useTimelineMap';
import useTranslation from '@shared/hooks/useTranslation';
import { CalendarIcon, CategoryIcon } from '@shared/icons';
import Ellipse from '@shared/icons/Ellipse';
import PinLocationSmall from '@shared/icons/PinLocationSmall';
import PrivacyOptionsIcon from '@shared/icons/PrivacyOptionsIcon';

import ViewAllPagePlaceholder from './components/view-all-page-placeholder/ViewAllPagePlaceholder';
import { EventHeader } from '../events/pages/event-page/components/event-header';
import EventStadium from '../events/pages/event-page/components/event-stadium/EventStadium';

import './ViewAllPage.scss';

const types: any = {
  organizations: {
    request: getOrganizationRequest,
    timeline: getOrganizationTimelineRequest,
    entity: 'organization',
  },
  events: {
    request: getEventRequest,
    timeline: getEventTimelineRequest,
  },
  profile: {
    request: getProfileRequest,
    timeline: getProfileTimelineRequest,
  },
  locations: {
    request: getLocationRequest,
    timeline: getLocationTimelineRequest,
  },
  timelines: {
    request: getTimelineRequest,
    timeline: getTimelineTimelineRequest,
  },
  'world-events': {
    request: null,
    timeline: getWorldTimelineRequest,
  },
};

function ViewAllPage() {
  const i18n = useTranslation('viewAll');
  const { type = '', id } = useParams();
  const [ searchParams ] = useSearchParams();
  const {
    markers, startDate, endDate, setTimelineMarkers, setVisibleTimelineMarkers,
  } = useTimelineMap();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [ loading, setLoading ] = useState(true);
  const [ data, setData ] = useState<any>({});
  const timeblockId = searchParams.get('tb');
  const [ queryParams, setQueryParams ] = useState<any>({});
  const query = Object.fromEntries(searchParams.entries());
  const isWorldEvents = location.pathname?.includes('/world-events');

  const loadData = async () => {
    const { request } = types[type] || {};

    try {
      if (!request) return;
      const resp = await dispatch(request(type === 'profile' ? {
        user_id: id,
      } : id)).$promise;
      setData(resp.data?.timeline || resp.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (filters = {}) => {
    setQueryParams((s: any) => ({
      ...s,
      ...filters,
    }));
  };

  useEffect(() => {
    if (type && !types[type]) {
      navigate('/404');
      return;
    }

    loadData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ type ]);

  return (
    <div className={classNames('view-all-page full-container', { 'event-page': data.game_mode })}>
      <Container className={classNames('page-wrapper mt-3', { 'event-page-wrapper': data.game_mode })} fluid>
        {loading && (
          <ViewAllPagePlaceholder />
        )}
        {!loading && (
          <>
            {(data.game_mode) && (
              <EventHeader
                event={data}
                date={query.title || ''}
                gameMode
                viewAll
              />
            )}
            <Container className="header">
              {(!isWorldEvents && !data.game_mode) && (
                <div className={classNames('mb-4', {
                  'mt-3 mt-md-5': !data.metadata,
                  'mt-3': data.metadata,
                })}
                >
                  <h2 className="h2">
                    {data.name || data.title || data.display_name}
                  </h2>
                  {data.description && (
                    <div className="description mb-2 text-truncate">
                      {data.description || data.bio}
                    </div>
                  )}
                  <div className="details caption1">
                    {data.category && (
                      <div className="details-item">
                        <CategoryIcon />
                        {data.category.name}
                        <Ellipse />
                      </div>
                    )}
                    {data.privacy_option && (
                      <div className="details-item ">
                        <PrivacyOptionsIcon width={18} height={18} />
                        {(i18n.label as any)[data.privacy_option]}
                        <Ellipse />
                      </div>
                    )}
                    {data.location && (
                      <div className="details-item">
                        <PinLocationSmall />
                        {data.location.name}
                        <Ellipse />
                      </div>
                    )}
                    <div className="details-item">
                      <CalendarIcon width={19} height={19} />
                      {query.title}
                    </div>
                  </div>
                </div>
              )}
            </Container>
          </>
        )}

        <ResizableTimeline
          mapComponent={data.game_mode ? (
            <EventStadium
              locations={markers}
              event={data}
              endDate={endDate}
              reload={handleApplyFilters}
            />
          ) : (
            <TimelineMap
              markers={markers}
              loading={loading}
              startDate={startDate}
              endDate={endDate}
              onSelectTimeRange={(d) => setQueryParams((s: any) => ({ ...s, ...d }))}
            />
          )}
          timeline={(
            <TimeblocksView
              id={timeblockId || ''}
              request={isWorldEvents ? types['world-events'].timeline : types[type].timeline}
              query={{
                ...queryParams,
                ...query,
                id: id || '',
              }}
              onChangeTimeline={setTimelineMarkers}
              onChangeVisibleItems={setVisibleTimelineMarkers}
            />
          )}
        />
      </Container>
    </div>
  );
}

export default ViewAllPage;
