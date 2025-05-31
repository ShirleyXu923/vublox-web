import classNames from 'classnames';
import { debounce } from 'lodash';
import React, {
  useCallback, useEffect, useState,
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Col } from 'reactstrap';

import { IRootState } from '@app/store';
import { randomBanners } from '@assets/img/ads';
import { getUpcomingEventsRequest } from '@reducers/event/EventAction';
import PostEventFilter from '@shared/components/AdvancedFilter/AdvancedFilter';
import useTranslation from '@shared/hooks/useTranslation';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

import PostItemCardPlaceholder from '../post-item-card/PostItemCardPlaceholder';
import UpcomingEventItemCard from '../upcoming-event-item-card/UpcomingEventItemCard';
import './UpcomingEventsTab.scss';

const placeholder = Array(6).fill(null);

function UpcomingTab({ active }: { active: boolean }) {
  const i18n = useTranslation('upcoming');
  const filters = useSelector((state: IRootState) => state.Category.advancedFilters.inverseFilters
   ?? {});
  const dispatch = useDispatch<any>();
  const [ loading, setLoading ] = useState(true);
  const [ searching, setSearching ] = useState(false);
  const [ events, setevents ] = useState([]);
  const [ meta, setMeta ] = useState({
    itemCount: 0,
    itemsPerPage: 9,
    currentPage: 1,
    nextPage: 2,
    cursor: null,
    cursor_id: null,
  });
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });
  const banners = randomBanners(1);

  const loadData = async (refresh = false, query = '', filter: any = {}) => {
    setLoading(true);

    const { categories: cat, ...rest } = filter;
    const params = {
      page: refresh ? 1 : meta.currentPage + 1,
      limit: 6,
      ...rest,
      category_ids: cat.map((f: any) => f.category_id || f.id),
      keyword: query,
    };

    try {
      const { data } = await dispatch(getUpcomingEventsRequest(params)).$promise;
      setevents((s: any) => (refresh ? data.items : [ ...s, ...data.items ]));
      setMeta(data.meta);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce((query, filter) => {
    loadData(true, query, filter);
  }, 2000), []);

  const onSearch = (value: string) => {
    setSearching(true);
    handleSearch(value, filters);
  };

  const renderPlaceholder = () => placeholder.map((_, i) => (
  // eslint-disable-next-line react/no-array-index-key
    <Col md={4} key={i}>
      <PostItemCardPlaceholder />
    </Col>
  ));

  const applyFilters = (newFilters: any) => {
    loadData(true, '', newFilters);
  };

  useEffect(() => {
    loadData(true, '', filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ filters ]);

  return (
    <div className={`upcoming ${isSmScreen ? 'mt-4' : 'mt-5'}`}>
      <div className="d-flex flex-column flex-sm-row mb-4 gap-2"> {/* Flex container: vertical on small screens, horizontal on larger screens */}
        {!isSmScreen && <h1 className="col-12 col-sm-auto">{i18n.label.upcoming}</h1>} {/* Discover label: full width on small screens, auto width on larger screens */}
        <div className="d-flex flex-fill justify-content-end gap-2 sm-gap-4 sm-justify-content-between"> {/* Flex container: align filter and search bar to the right with spacing between them */}
          <PostEventFilter upcoming onApply={applyFilters} />
          <div className="search-bar-container"> {/* Wrapper for search bar alignment */}
            <SearchBar onSearch={onSearch} iconPlacement="left" loading={searching} />
          </div>
        </div>
      </div>

      {!loading && events.length === 0 && (
        <div className="empty">
          {i18n.label.empty}
        </div>
      )}

      <InfiniteScroll
        dataLength={events.length}
        next={() => loadData(false, '', filters)}
        hasMore={active && meta.currentPage < meta.nextPage}
        loader={renderPlaceholder()}
        className={classNames('row row-gap-4')}
      >
        {events.slice(0, 6).map((post: any) => (
          <Col key={post.id} md={6}>
            <UpcomingEventItemCard
              key={post.id}
              item={post}
            />
          </Col>
        ))}

        {events.length > 0 && (
          <Col md={12}>
            <img src={banners[0]} width="100%" alt="Ad" className="ad mb-4" />
          </Col>
        )}

        {events.slice(6).map((post: any) => (
          <Col key={post.id} md={6}>
            <UpcomingEventItemCard
              key={post.id}
              item={post}
            />
          </Col>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default UpcomingTab;
