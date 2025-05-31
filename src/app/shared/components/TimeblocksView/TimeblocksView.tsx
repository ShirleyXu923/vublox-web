import { debounce, isEqual } from 'lodash';
import moment from 'moment';
import React, {
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ReactVisibilitySensor from 'react-visibility-sensor';
import { Col, Row } from 'reactstrap';

import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import FilterButton from '@shared/buttons/FilterButton';
import SortButton from '@shared/buttons/SortButton';
import TuneIcon from '@shared/icons/TuneIcon';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

// import { TimelineLoader } from './components/timeline-loader';
import './TimeblocksView.scss';

import EventCard from './components/event-card/EventCard';
import ItemCardPlaceholder from './components/item-card-placeholder/ItemCardPlaceholder';
import OrganizationBioCard from './components/organization-bio-card/OrganizationBioCard';
import OrganizationCard from './components/organization-card/OrganizationCard';
import OrganizationCoverPhotoCard from './components/organization-cover-photo-card/OrganizationCoverPhotoCard';
import OrganizationLocationCard from './components/organization-location-card/OrganizationLocationCard';
import OrganizationLogoCard from './components/organization-logo-card/OrganizationLogoCard';
import OrganizationNameCard from './components/organization-name-card/OrganizationNameCard';
import PostCard from './components/post-card/PostCard';
import TimelineCard from './components/timeline-card/TimelineCard';
import EventModal from '../PreviewModal/EventModal/EventModal';
import OrganizationModal from '../PreviewModal/OrganizationModal/OrganizationModal';
import PostModal from '../PreviewModal/PostModal/PostModal';
import TimelineModal from '../PreviewModal/TimelineModal/TimelineModal';

const cardComponents: any = {
  Post: PostCard,
  Event: EventCard,
  Timeline: TimelineCard,
  Organization: OrganizationCard,
  'Organization.Name': OrganizationNameCard,
  'Organization.CoverPhoto': OrganizationCoverPhotoCard,
  'Organization.Logo': OrganizationLogoCard,
  'Organization.Bio': OrganizationBioCard,
  'Organization.Location': OrganizationLocationCard,
};

interface SortType {
  label: string;
  value: 'latest-to-oldest' | 'oldest-to-latest'
}

interface TimeblocksViewProps {
  id: string;
  request: any;
  query?: any;
  onChangeVisibleItems?: ((isVisible: boolean, items: any[]) => void);
  onChangeTimeline?: (timeline: any[]) => void;
  defaultSort?: 'latest-to-oldest' | 'oldest-to-latest'
}

const placeholder = new Array(6).fill(0);

function TimeblocksView({
  id,
  request,
  query,
  onChangeVisibleItems,
  onChangeTimeline,
  defaultSort,
}: TimeblocksViewProps) {
  const i18n = LocaleService.getTranslations('accordionTimeline');
  const location = useLocation();
  const showHistorical = location.pathname.startsWith('/profile');
  const [ meta, setMeta ] = useState<any>({
    currentPage: 1,
  });
  const [ items, setItems ] = useState<any>([]);
  const [ selectedSort, setSelectedSort ] = useState(defaultSort || 'latest-to-oldest');
  const [ filter, setFilter ] = useState<string[]>(showHistorical ? [ 'posts', 'personal', 'tagged', 'tags', 'historical' ] : [ 'posts', 'personal', 'tagged', 'tags' ]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(true);
  const [ sortItems ] = useState<SortType[]>([
    {
      label: i18n.label.latestToOldest,
      value: 'latest-to-oldest',
    },
    {
      label: i18n.label.oldestToLatest,
      value: 'oldest-to-latest',
    },
  ]);
  const [ keyword, setKeyword ] = useState('');
  const [ searching, setSearching ] = useState(false);
  const [ showPost, setShowPost ] = useState(false);
  const [ showEvent, setShowEvent ] = useState(false);
  const [ showTimeline, setShowTimeline ] = useState(false);
  const [ showOrganization, setShowOrganization ] = useState(false);
  const [ selectedPost, setSelectedPost ] = useState<string | undefined>(undefined);
  const [ selectedEvent, setSelectedEvent ] = useState<string | undefined>(undefined);
  const [ selectedTimeline, setSelectedTimeline ] = useState<string | undefined>(undefined);
  const [ selectedOrganization, setSelectedOrganization ] = useState<string | undefined>(undefined);
  const dispatch = useDispatch<any>();

  const onSelectSort = (item: SortType) => {
    setSelectedSort(item?.value);
  };

  const onSelectFilter = (item: string[]) => {
    setFilter(item);
  };

  const loadData = async (refresh = false) => {
    if (isLoading) return;
    if (refresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    const {
      currentPage, nextPage, itemsPerPage, ...rest
    } = meta;
    const params = {
      timeblock_id: id,
      ...(query || {}),
      filter,
      page: refresh ? 1 : currentPage + 1,
      limit: 9,
      sort: selectedSort === 'latest-to-oldest'
        ? 'DESC' : 'ASC',
      tz: moment.tz.guess(),
      keyword,
      ...(refresh ? {} : rest),
    } as any;

    try {
      const { data: resp } = await dispatch(request(params)).$promise;
      setMeta(resp.meta);

      if (refresh) {
        setItems(resp.items);
        return;
      }

      if (resp.items?.length === 0) return;

      setItems((s: any) => {
        const lastGroup: any = s[s.length - 1];
        const newItems = [ ...s ];

        const lastItem = resp.items[0];
        if (lastGroup?.id === lastItem.id && lastItem?.items?.length > 0) {
          const index = s.findIndex((i: any) => i.id === lastItem.id);
          newItems[index] = {
            ...newItems[index],
            items: [
              ...newItems[index].items,
              ...lastItem.items,
            ],
          };
        }

        return [
          ...newItems,
          ...resp.items.filter((i: any) => i.id !== lastGroup?.id),
        ];
      });
    } catch (err) {
      handleError(err);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
      setSearching(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce((value) => {
    setKeyword(value);
  }, 2000), []);

  const onSearch = (value: string) => {
    setSearching(true);
    handleSearch(value);
  };

  const navigateToItem = (item: any) => {
    window.open(`/${item.page_type?.toLowerCase()}s/${item.slug || item.id}`, '_blank');
  };

  const handleSelect = (e: any, item: any, type: string) => {
    e.preventDefault();

    if (type?.toLowerCase() === 'post') {
      setSelectedPost(item);
      setShowPost(true);
      return;
    }

    if (type?.toLowerCase() === 'event') {
      setSelectedEvent(item);
      setShowEvent(true);
      return;
    }

    if (type?.toLowerCase() === 'timeline') {
      setSelectedTimeline(item);
      setShowTimeline(true);
      return;
    }

    if (type?.toLowerCase() === 'organization') {
      setSelectedOrganization(item);
      setShowOrganization(true);
      return;
    }

    navigateToItem(item);
  };

  const renderPlaceholder = () => placeholder.map((_, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <Col md={6} key={i}>
      <ItemCardPlaceholder />
    </Col>
  ));

  useEffect(() => {
    loadData(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ selectedSort, filter, query, keyword, id ]);

  useEffect(() => {
    onChangeTimeline?.(items);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ items.length ]);

  return (
    <div className="timeblocks-view pb-4">
      <div className="filters mb-4">
        <FilterButton
          sortIcon={<TuneIcon />}
          onSelect={onSelectFilter}
          selectedFilters={filter}
          setSelectedFilters={setFilter}
          showHistorical={showHistorical}
        />
        <SortButton
          onSelect={onSelectSort}
          label={selectedSort === 'latest-to-oldest' ? i18n.label.latestToOldest : i18n.label.oldestToLatest}
          items={sortItems}
        />
        <SearchBar onSearch={onSearch} loading={searching} />
      </div>

      {refreshing && (
        <Row className="row-gap-4">
          {renderPlaceholder()}
        </Row>
      )}

      <InfiniteScroll
        dataLength={items.length}
        next={loadData}
        hasMore={meta.currentPage < meta.nextPage}
        loader={renderPlaceholder()}
        className="row row-gap-4"
      >
        {items?.map((item: any) => {
          const Component = cardComponents[item.type];
          return Component ? (
            <Col key={item.id} md={6}>
              <ReactVisibilitySensor
                onChange={(isVisible: boolean) => onChangeVisibleItems?.(isVisible, item)}
              >
                <Component
                  data={item.data}
                  onClick={(e: any) => handleSelect(e, item.data, item.type)}
                />
              </ReactVisibilitySensor>
            </Col>
          ) : <span>{item.type}</span>;
        })}
      </InfiniteScroll>

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

export default memo(TimeblocksView, (prevProps, nextProps) => isEqual(prevProps, nextProps));
