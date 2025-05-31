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
import { Button } from 'reactstrap';

import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';

import CustomTimeLineResponsiveLoader from './components/custom-timeline-responsive-loader/CustomTimeLineResponsiveLoader';
import { TimelineHeader } from './components/timeline-header';
import { TimelineHeaderProps } from './components/timeline-header/TimelineHeader';

import './AccordionTimeline.scss';

// import { TimelineLoader } from './components/timeline-loader';

interface TimeScaleType {
  label: string;
  value: string;
}

interface SortType {
  label: string;
  value: 'latest-to-oldest' | 'oldest-to-latest'
}

interface AccordionTimelineProps {
  TimelineHeaderComponent?: React.ComponentType<TimelineHeaderProps> | undefined;
  secondsTimescale?: boolean;
  createPostLink?: string;
  createEventLink?: string;
  createTimelineLink?: string;
  showFiltersOnly?: boolean;
  timelineHeaderProps?: any;
  request?: any;
  query?: any;
  onChangeVisibleItems?: ((isVisible: boolean, items: any[]) => void);
  onChangeTimeline?: (timeline: any[]) => void;
  onChangeDates: (start: Date | string, end: Date | string) => void;
  contributeDisabled?: boolean;
  gameMode?: boolean;
  defaultSort?: 'latest-to-oldest' | 'oldest-to-latest'
  defaultTimescale?: string;
  hideContributePost?: boolean;
  preview?: boolean;
  link?: string;
  TimelineComponent: React.FC<any>;
}

function AccordionTimeline({
  TimelineHeaderComponent,
  secondsTimescale,
  createPostLink = '/posts/create#step-1',
  createEventLink = '/events/create#step-1',
  createTimelineLink = '/timelines/create',
  showFiltersOnly,
  timelineHeaderProps = {},
  request,
  query,
  onChangeVisibleItems,
  onChangeTimeline,
  onChangeDates,
  contributeDisabled,
  gameMode,
  defaultSort,
  defaultTimescale,
  hideContributePost,
  preview,
  link,
  TimelineComponent,
}: AccordionTimelineProps) {
  const i18n = LocaleService.getTranslations('accordionTimeline');
  const location = useLocation();
  const showHistorical = location.pathname.startsWith('/profile');
  const [ meta, setMeta ] = useState<any>({
    currentPage: 1,
  });
  const [ items, setItems ] = useState<any>([]);
  const [ selectedSort, setSelectedSort ] = useState(defaultSort || 'latest-to-oldest');
  const [ selectedTimeScale, setSelectedTimeScale ] = useState(defaultTimescale || '10-y');
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
  const dispatch = useDispatch<any>();

  const [ yearItems ] = useState<TimeScaleType[]>([
    ...(secondsTimescale ? [
      {
        label: i18n.label.oneSecond,
        value: '1-sec',
      },
      {
        label: i18n.label.fiveSeconds,
        value: '5-sec',
      },
      {
        label: i18n.label.tenSeconds,
        value: '10-sec',
      },
      {
        label: i18n.label.twentySeconds,
        value: '20-sec',
      },
    ] : []),
    {
      label: i18n.label.fiveMin,
      value: '5-min',
    },
    {
      label: i18n.label.thirtyMin,
      value: '30-min',
    },
    {
      label: i18n.label.oneHour,
      value: '1-h',
    },
    {
      label: i18n.label.eightHours,
      value: '8-h',
    },
    {
      label: i18n.label.twentyFourHours,
      value: '24-h',
    },
    {
      label: i18n.label.oneMonth,
      value: '1-mo',
    },
    {
      label: i18n.label.oneYear,
      value: '1-y',
    },
    {
      label: i18n.label.fiveYears,
      value: '5-y',
    },
    {
      label: i18n.label.tenYears,
      value: '10-y',
    },
  ]);

  const onSelectTimeScale = useCallback((item: TimeScaleType) => {
    setSelectedTimeScale(item.value);
  }, []);

  const onSelectSort = (item: SortType) => {
    setSelectedSort(item?.value);
  };

  const onSelectFilter = (item: string[]) => {
    setFilter(item);
  };

  const loadData = async (p: any, refresh = false) => {
    if (isLoading || (preview && !refresh)) return;
    if (refresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    const [ value, unit ] = p.selectedTimeScale.split('-');
    const {
      currentPage, nextPage, itemsPerPage, ...rest
    } = meta;
    const params = {
      ...(p.query || {}),
      filter,
      page: refresh ? 1 : currentPage + 1,
      limit: 20,
      ts_unit: unit,
      ts_value: value,
      sort: p.selectedSort === 'latest-to-oldest'
        ? 'DESC' : 'ASC',
      tz: moment.tz.guess(),
      keyword,
      ...(refresh ? {} : rest),
      min: meta.min || '',
      max: meta.max || '',
    } as any;

    try {
      const { data: resp } = await dispatch(request(params)).$promise;
      setMeta((s: any) => ({
        ...s,
        ...resp.meta,
        min: resp.meta?.min || s.min,
        max: resp.meta?.max || s.max,
      }));

      if (refresh) {
        setItems(resp.items);
        return;
      }

      if (resp.items?.length === 0) return;

      setItems((s: any) => {
        const lastGroup: any = s[s.length - 1];
        const newItems = [ ...s ];

        const lastItem = resp.items[0];
        if (lastGroup?.id === lastItem.id && lastGroup?.items?.length > 0) {
          const index = s.findIndex((i: any) => i.id === lastItem.id);
          newItems[index] = {
            ...newItems[index],
            items: [
              ...newItems[index].items,
              ...lastItem.items,
            ].splice(0, 8),
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
  }, 2000), [ meta ]);

  const onSearch = (value: string) => {
    setSearching(true);
    handleSearch(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLoadData = useCallback(debounce((params, refresh = false) => loadData(params,
    refresh), 300), [ meta ]);

  const loadMore = () => {
    handleLoadData({
      selectedSort, selectedTimeScale, filter, query, keyword,
    });
  };

  useEffect(() => {
    handleLoadData({
      selectedSort, selectedTimeScale, filter, query, keyword,
    }, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ selectedSort, selectedTimeScale, filter, query, keyword ]);

  useEffect(() => {
    onChangeTimeline?.(items);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ items.length ]);

  useEffect(() => {
    if (meta.min && meta.max) {
      onChangeDates?.(meta.min, meta.max);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ meta.min, meta.max ]);

  return (
    <div className="accordion-timeline">
      {TimelineHeaderComponent ? (
        <TimelineHeaderComponent
          contributeDisabled={contributeDisabled}
          yearItems={yearItems}
          sortItems={sortItems}
          onSelectSort={onSelectSort}
          onSelectTimeScale={onSelectTimeScale}
          onSelectFilter={onSelectFilter}
          createPostLink={createPostLink}
          createEventLink={createEventLink}
          createTimelineLink={createTimelineLink}
          showFiltersOnly={showFiltersOnly}
          timelineHeaderProps={timelineHeaderProps}
          selectedTimeScale={selectedTimeScale}
          selectedSort={selectedSort}
          gameMode={gameMode}
          onSearch={onSearch}
          searching={searching}
        />
      ) : (
        <TimelineHeader
          hideContributePost={hideContributePost}
          contributeDisabled={contributeDisabled}
          yearItems={yearItems}
          sortItems={sortItems}
          onSelectSort={onSelectSort}
          onSelectTimeScale={onSelectTimeScale}
          onSelectFilter={onSelectFilter}
          createPostLink={createPostLink}
          createEventLink={createEventLink}
          createTimelineLink={createTimelineLink}
          showFiltersOnly={showFiltersOnly}
          timelineHeaderProps={timelineHeaderProps}
          selectedTimeScale={selectedTimeScale}
          selectedSort={selectedSort}
          gameMode={gameMode}
          onSearch={onSearch}
          searching={searching}
        />
      )}
      {refreshing && (
        <CustomTimeLineResponsiveLoader />
      )}

      <InfiniteScroll
        dataLength={Object.keys(items).length}
        next={loadMore}
        hasMore={meta.currentPage < meta.nextPage}
        loader={null}
      >
        <TimelineComponent
          timeblockables={items}
          onChangeVisibleItems={onChangeVisibleItems}
          timescale={selectedTimeScale}
          query={query}
        />

        {(preview && meta.currentPage < meta.nextPage) && (
          <div className="p-4 pb-0 text-center">
            <Button
              outline
              className="py-2 px-5"
              color="primary"
              size="sm"
              onClick={() => window.open(link, '_blank')}
            >
              View More
            </Button>
          </div>
        )}
      </InfiniteScroll>

      {isLoading && (
        <div>
          <CustomTimeLineResponsiveLoader />
        </div>
      )}
    </div>
  );
}

export default memo(AccordionTimeline, (prevProps, nextProps) => isEqual(prevProps, nextProps));
