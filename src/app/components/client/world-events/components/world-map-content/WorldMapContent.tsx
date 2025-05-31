import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';

import { IRootState } from '@app/store';
import { searchWorldViewRequest } from '@reducers/search/SearchAction';
import { getWorldTimelineRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import { AccordionTimeline } from '@shared/components/AccordionTimeline';
import { Timeline } from '@shared/components/AccordionTimeline/components/timeline';
import EventModal from '@shared/components/PreviewModal/EventModal/EventModal';
import OrganizationModal from '@shared/components/PreviewModal/OrganizationModal/OrganizationModal';
import PostModal from '@shared/components/PreviewModal/PostModal/PostModal';
import TimelineModal from '@shared/components/PreviewModal/TimelineModal/TimelineModal';
import ResizableTimeline from '@shared/components/ResizableTimeline/ResizableTimeline';
import useDeepEffect from '@shared/hooks/useDeepEffect';

import MapComponent from './map-component/MapComponent';
// import WorldTimelineHeader from '../world-timeline-header/WorldTimelineHeader';

interface WorldMapContentProps {
  params?: any;
  mapId: string;
  location?: any;
  defaultSort?: 'latest-to-oldest' | 'oldest-to-latest';
  defaultTimescale?: string;
}

function WorldMapContent({
  params = {}, mapId, location, defaultSort, defaultTimescale,
}: WorldMapContentProps) {
  // const i18n = useTranslation('worldEvents');
  const filters = useSelector(({ Category }: IRootState) => Category.advancedFilters.filters);
  const { categories, ...restFilters } = filters;
  const dispatch = useDispatch<any>();
  const [ isFixed, setIsFixed ] = useState(false);
  const [ scrollPosition, setScrollPosition ] = useState(0);
  const mapRef = useRef<any>();
  const { state } = useLocation();
  const [ timeline, setTimeline ] = useState<any>(state);
  const [ events, setEvents ] = useState<any[]>([]);
  const [ query, setQuery ] = useState<any>(mapId === 'trending'
    || mapId === 'discover' ? params : {
      ...restFilters,
      ...params,
      page: 1,
      limit: 10,
      category_ids: categories.map((f: any) => f.category_id || f.id),
      include_posts: 'false',
    });
  const [ bounds, setBounds ] = useState<google.maps.LatLngBounds>();
  const isMdScreen = useMediaQuery({ query: '(max-width: 991px)' });
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });

  const [ showPost, setShowPost ] = useState(false);
  const [ showEvent, setShowEvent ] = useState(false);
  const [ showTimeline, setShowTimeline ] = useState(false);
  const [ showOrganization, setShowOrganization ] = useState(false);
  const [ selectedPost, setSelectedPost ] = useState<string | undefined>(undefined);
  const [ selectedEvent, setSelectedEvent ] = useState<string | undefined>(undefined);
  const [ selectedTimeline, setSelectedTimeline ] = useState<string | undefined>(undefined);
  const [ selectedOrganization, setSelectedOrganization ] = useState<string | undefined>(undefined);
  const [ startDate, setStartDate ] = useState<Date | string>(new Date());
  const [ endDate, setEndDate ] = useState<Date | string>(new Date());

  const handleSetTimeline = (item: any) => {
    setTimeline(item);

    if (item.page_type?.toLowerCase() === 'post') {
      setSelectedPost(item);
      setShowPost(true);
      return;
    }

    if (item.page_type?.toLowerCase() === 'event') {
      setSelectedEvent(item);
      setShowEvent(true);
      return;
    }

    if (item.page_type?.toLowerCase() === 'timeline') {
      setSelectedTimeline(item);
      setShowTimeline(true);
    }

    if (item.page_type?.toLowerCase() === 'organization') {
      setSelectedOrganization(item);
      setShowOrganization(true);
    }
  };

  const loadData = async (filter: any = {}) => {
    if (mapId !== 'trending') return;

    const ne = bounds?.getNorthEast();
    const sw = bounds?.getSouthWest();
    try {
      const { categories: cat, ...rest } = filter;

      let queryParams = {
        page: 1,
        limit: 10,
        category_ids: cat.map((f: any) => f.category_id || f.id),
        include_posts: 'false',
        ...rest,
        ...params,
      };

      if (ne && sw) {
        queryParams = {
          ...queryParams,
          'region[min][latitude]': sw?.lat() || -66.10858496794279,
          'region[min][longitude]': sw?.lng() || -180,
          'region[max][latitude]': ne?.lat() || 79.22832227512149,
          'region[max][longitude]': ne?.lng() || 180,
        };
      }

      const { data } = await dispatch(searchWorldViewRequest(queryParams)).$promise;
      setEvents(data.map((d: any) => ({
        ...d,
        active: true,
      })));
    } catch (e) {
      handleError(e);
    }
  };

  const onRefresh = () => {
    const ne = bounds?.getNorthEast();
    const sw = bounds?.getSouthWest();

    setQuery((q: any) => ({
      ...q,
      'region[min][latitude]': sw?.lat() || -66.10858496794279,
      'region[min][longitude]': sw?.lng() || -180,
      'region[max][latitude]': ne?.lat() || 79.22832227512149,
      'region[max][longitude]': ne?.lng() || 180,
    }));
  };

  const setTimelineEvents = (items: any[] = []) => {
    setEvents(items?.[0]?.items?.map?.((i: any) => ({
      page_type: i.type,
      ...i.data,
    })) || []);
  };

  const setVisibleTimelineEvents = (visible: boolean, items: any[]) => {
    if (items?.length === 0 || !visible) return;
    setEvents(items.map((e: any) => ({
      page_type: e.type,
      ...e.data,
    })));
  };

  useDeepEffect(() => {
    loadData(filters);
    const { categories: cat, ...rest } = filters;

    const ne = bounds?.getNorthEast();
    const sw = bounds?.getSouthWest();

    let queryParams = {
      page: 1,
      limit: 10,
      category_ids: cat.map((f: any) => f.category_id || f.id),
      include_posts: 'false',
      ...rest,
      ...params,
    };

    if (ne && sw) {
      queryParams = {
        ...queryParams,
        'region[min][latitude]': sw?.lat() || -66.10858496794279,
        'region[min][longitude]': sw?.lng() || -180,
        'region[max][latitude]': ne?.lat() || 79.22832227512149,
        'region[max][longitude]': ne?.lng() || 180,
      };
    }

    setQuery(queryParams);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ filters ]);

  useEffect(() => {
    const handleScroll = () => {
      if (!isSmScreen) return;
      const scrollTop = window.pageYOffset;
      const offsetTop = mapRef.current?.offsetTop || 300;
      const position = offsetTop;

      // Ignore scroll position jump due to height change or if no more space to scroll
      const isAtBottom = Math.ceil(window.innerHeight + window.scrollY)
        >= document.documentElement.scrollHeight;
      const isScrollUp = scrollTop < scrollPosition;
      let offset = isMdScreen ? 75 : 100;
      offset = isSmScreen ? 0 : offset;

      if ((Math.abs(scrollTop - scrollPosition) > offset && isScrollUp) || isAtBottom) {
        setScrollPosition(scrollTop);
        return;
      }

      // Change the threshold as needed
      if (scrollTop > position && !isFixed && !isScrollUp) {
        setIsFixed(true);
      } else if (scrollTop <= position && isFixed && isScrollUp) {
        setIsFixed(false);
      }
      setScrollPosition(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ mapRef.current, scrollPosition, isFixed ]);

  return (
    <div className={`world-map-content ${isXsScreen ? 'py-2' : ''}`}>
      {mapId === 'trending' ? (
        <MapComponent
          mapId={mapId}
          mapRef={mapRef}
          isFixed={isFixed}
          setBounds={setBounds}
          events={events}
          handleSetEvent={handleSetTimeline}
          onRefresh={onRefresh}
          location={location}
          selectedEvent={timeline}
          startDate={startDate}
          endDate={endDate}
          onSelectTimeRange={(data: any) => setQuery((s: any) => ({ ...s, ...data }))}
        />
      ) : (
        <ResizableTimeline
          mapComponent={(
            <MapComponent
              mapId={mapId}
              mapRef={mapRef}
              isFixed={isFixed}
              setBounds={setBounds}
              events={events}
              handleSetEvent={handleSetTimeline}
              onRefresh={onRefresh}
              location={location}
              selectedEvent={timeline}
              startDate={startDate}
              endDate={endDate}
              onSelectTimeRange={(data: any) => setQuery((s: any) => ({ ...s, ...data }))}
            />
          )}
          timeline={(mapId !== 'trending' && !!query.category_ids) ? (
            <AccordionTimeline
              hideContributePost={mapId === 'upcoming'}
              request={getWorldTimelineRequest}
              timelineHeaderProps={{
                event: timeline,
              }}
              createPostLink=""
              onChangeTimeline={setTimelineEvents}
              onChangeVisibleItems={setVisibleTimelineEvents}
              onChangeDates={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              query={query}
              defaultSort={defaultSort}
              defaultTimescale={defaultTimescale}
              TimelineComponent={Timeline}
            />
          ) : null}
        />
      )}

      <PostModal
        item={selectedPost}
        show={showPost}
        toggle={() => setShowPost(false)}
      />

      <EventModal
        item={selectedEvent}
        show={showEvent}
        toggle={() => setShowEvent(false)}
      />

      <TimelineModal
        item={selectedTimeline}
        show={showTimeline}
        toggle={() => setShowTimeline(false)}
      />

      <OrganizationModal
        item={selectedOrganization}
        show={showOrganization}
        toggle={() => setShowOrganization(false)}
      />
    </div>
  );
}

export default WorldMapContent;
