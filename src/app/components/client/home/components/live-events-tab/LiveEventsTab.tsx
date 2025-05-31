import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Button } from 'reactstrap';

import { IRootState } from '@app/store';
import ads, { randomBanners } from '@assets/img/ads';
import { saveClientInterestsRequest } from '@reducers/app/AppAction';
import { getFeaturedEventsRequest } from '@reducers/event/EventAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import FollowSelectionModal from '@shared/components/FollowSelection/FollowSelectionModal';
import EventModal from '@shared/components/PreviewModal/EventModal/EventModal';
import PostModal from '@shared/components/PreviewModal/PostModal/PostModal';
import useDeepEffect from '@shared/hooks/useDeepEffect';
import useTranslation from '@shared/hooks/useTranslation';

import EventFilter, { EventFilterRef } from '../event-filter/EventFilter';
import EventItemCard from '../event-item-card/EventItemCard';
import EventItemCardPlaceholder from '../event-item-card/EventItemCardPlaceholder';

import './LiveEventsTab.scss';

const placeholder = Array(6).fill(null);

function LiveEventsTab() {
  const i18n = useTranslation('live');
  const filters = useSelector((state: IRootState) => state.Category.selectedFilters ?? []);
  const [ events, setEvents ] = useState<any>({
    trending: [],
    latest: [],
  });
  const [ loading, setLoading ] = useState(true);
  const [ showFollowSelection, setShowFollowSelection ] = useState(false);
  const [ showPost, setShowPost ] = useState(false);
  const [ selectedPost, setSelectedPost ] = useState(null);
  const [ showEvent, setShowEvent ] = useState(false);
  const [ selectedEvent, setSelectedEvent ] = useState(null);
  const dispatch = useDispatch<any>();
  const eventFilter = useRef<EventFilterRef>(null);
  const isMdScreen = useMediaQuery({ query: '(max-width: 767px)' });
  const isSmScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const banners = randomBanners(2);

  const loadFilteredData = async (filter = 'trending') => {
    try {
      const cat = filters;
      const { data } = await dispatch(getFeaturedEventsRequest({
        filter,
        category_ids: cat.map((f: any) => f.category_id || f.id),
        type: 'live',
      })).$promise;
      setEvents((s: any) => ({
        ...s,
        [filter]: data,
      }));
    } catch (err) {
      handleError(err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await loadFilteredData();
      await loadFilteredData('latest');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInterests = async (fi: any) => {
    try {
      await dispatch(saveClientInterestsRequest({
        category_ids: fi.map((f: any) => f.category_id || f.id),
      })).$promise;
    } catch (err) {
      handleError(err);
    }
  };

  const onViewPost = (post: any) => {
    setSelectedPost(post);
    setShowPost(true);
  };

  const onViewEvent = (event: any) => {
    setSelectedEvent(event);
    setShowEvent(true);
  };

  useDeepEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ filters ]);

  return (
    <div className={`live-events ${isSmScreen ? 'mt-4' : 'mt-5'}`}>
      <div className="d-flex justify-content-between mb-4">
        { !isSmScreen && (<h1>{i18n.label.live}</h1>)}
        <div className="d-flex align-items-center event-filter-container">
          <EventFilter
            ref={eventFilter}
            handleApply={handleSaveInterests}
          />
        </div>
      </div>
      {loading && events.trending.length === 0 && placeholder.map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <EventItemCardPlaceholder key={i} />
      ))}

      {events.trending.slice(0, 3).map((e: any, i: number) => (
        <EventItemCard
          key={e.id}
          item={e}
          ad={(ads.ads as any)[`ad${i + 1}`]}
          onViewPost={onViewPost}
          onViewEvent={onViewEvent}
        />
      ))}

      {events.trending.length > 0 && (
        <img src={banners[0]} width="100%" alt="Ad" className="ad mb-4" />
      )}

      {events.trending.slice(3).map((e: any, i: number) => (
        <EventItemCard
          key={e.id}
          item={e}
          ad={(ads.ads as any)[`ad${i + 1}`]}
          onViewPost={onViewPost}
          onViewEvent={onViewEvent}
        />
      ))}

      {!loading && events.trending.length === 0 && (
        <div className="empty">
          {isMdScreen ? (
          // For small screens
            <span className="d-inline">
              <span>{i18n.label.empty}</span>
              {LocaleService.parseTranslation(i18n.label.empty2, {
                selectCategory: (
                  <Button
                    color="link"
                    className="p-0 m-0 fw-bold"
                    onClick={() => eventFilter?.current?.open?.()}
                  >
                    {i18n.label.selectCategory}
                  </Button>
                ),
                follow: (
                  <Button
                    color="link"
                    className="p-0 m-0 d-inline fw-bold"
                    onClick={() => setShowFollowSelection(true)}
                  >
                    {i18n.label.follow}
                  </Button>
                ),
              })}
            </span>
          ) : (
          // For larger screens
            <>
              {i18n.label.empty} <br />
              <div className="d-flex">
                {LocaleService.parseTranslation(i18n.label.empty2, {
                  selectCategory: (
                    <Button
                      color="link"
                      className="p-0 m-0"
                      onClick={() => eventFilter?.current?.open?.()}
                    >
                    &nbsp;{i18n.label.selectCategory}&nbsp;
                    </Button>
                  ),
                  follow: (
                    <Button
                      color="link"
                      className="p-0 m-0 d-inline"
                      onClick={() => setShowFollowSelection(true)}
                    >
                    &nbsp;{i18n.label.follow}&nbsp;
                    </Button>
                  ),
                })}
              </div>
            </>
          )}
        </div>
      )}

      {events.latest?.length > 0 && (
        <>
          <h1 className="mt-5 mb-4">{i18n.label.latest}</h1>

          {events.latest.slice(0, 3).map((e: any, i: number) => (
            <EventItemCard
              key={e.id}
              item={e}
              ad={(ads.ads as any)[`ad${i + 1}`]}
              onViewPost={onViewPost}
              onViewEvent={onViewEvent}
            />
          ))}

          <img src={banners[1]} width="100%" alt="Ad" className="ad mb-4" />

          {events.latest.slice(3).map((e: any, i: number) => (
            <EventItemCard
              key={e.id}
              item={e}
              ad={(ads.ads as any)[`ad${i + 1}`]}
              onViewPost={onViewPost}
              onViewEvent={onViewEvent}
            />
          ))}

        </>
      )}

      <FollowSelectionModal
        show={showFollowSelection}
        toggle={() => setShowFollowSelection(false)}
        onSubmit={loadData}
      />

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
    </div>
  );
}

export default LiveEventsTab;
