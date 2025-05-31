import classNames from 'classnames';
import { debounce } from 'lodash';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Button, Col } from 'reactstrap';
import { Mousewheel } from 'swiper/modules';
import { SwiperRef, Swiper, SwiperSlide } from 'swiper/react';

import { IRootState } from '@app/store';
import { getDiscoverPostsRequest } from '@reducers/post/PostAction';
import BackButton from '@shared/buttons/BackButton';
import PostEventFilter from '@shared/components/AdvancedFilter/AdvancedFilter';
import useTranslation from '@shared/hooks/useTranslation';
import { CaretDownIcon, CaretUpIcon } from '@shared/icons';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

import PostItemCard from '../post-item-card/PostItemCard';
import PostItemCardPlaceholder from '../post-item-card/PostItemCardPlaceholder';

import 'swiper/css';
import './DiscoverTab.scss';

const placeholder = Array(6).fill(null);

function DiscoverTab({ active }: { active: boolean }) {
  const i18n = useTranslation('discover');
  const filters = useSelector((state: IRootState) => state.Category.advancedFilters
    .inverseFilters ?? {});
  const dispatch = useDispatch<any>();
  const [ loading, setLoading ] = useState(true);
  const [ searching, setSearching ] = useState(false);
  const [ posts, setPosts ] = useState([]);
  const [ meta, setMeta ] = useState({
    itemCount: 0,
    itemsPerPage: 9,
    currentPage: 1,
    nextPage: 2,
    cursor: null,
    cursor_id: null,
  });
  const [ view, setView ] = useState('grid');
  const swiper = useRef<SwiperRef>(null);
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });

  const loadData = async (refresh = false, query = '', filter: any = {}) => {
    setLoading(true);

    const { categories: cat, ...rest } = filter;
    const params = {
      page: refresh ? 1 : meta.currentPage + 1,
      limit: 9,
      ...rest,
      category_ids: cat.map((f: any) => f.category_id || f.id),
      keyword: query,
    };

    try {
      const { data } = await dispatch(getDiscoverPostsRequest(params)).$promise;
      setPosts((s: any) => (refresh ? data.items : [ ...s, ...data.items ]));
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

  const toggleView = (index: number) => {
    setView((s: any) => (s === 'grid' ? 'item' : 'grid'));
    swiper.current?.swiper.slideTo(index);
  };

  const renderPlaceholder = () => placeholder.map((_, i) => (
  // eslint-disable-next-line react/no-array-index-key
    <Col md={4} key={i}>
      <PostItemCardPlaceholder />
    </Col>
  ));

  useEffect(() => {
    loadData(true, '', filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ filters ]);

  useEffect(() => {
    setTimeout(() => {
      swiper.current?.swiper?.update?.();
    }, 2000);
  }, []);

  return (
    <div id="discover-tab" className={`discover ${isSmScreen ? 'mt-4' : 'mt-5'}`}>
      <div className="d-flex flex-column flex-sm-row mb-4 gap-2"> {/* Flex container: vertical on small screens, horizontal on larger screens */}
        {!isSmScreen && <h1 className="col-12 col-sm-auto">{i18n.label.discover}</h1>} {/* Discover label: full width on small screens, auto width on larger screens */}
        <div className="d-flex flex-fill justify-content-end gap-2 sm-gap-4 sm-justify-content-between"> {/* Flex container: align filter and search bar to the right with spacing between them */}
          <PostEventFilter inverse />
          <div className="search-bar-container"> {/* Wrapper for search bar alignment */}
            <SearchBar onSearch={onSearch} iconPlacement="left" loading={searching} />
          </div>
        </div>
      </div>

      {!loading && posts.length === 0 && (
        <div className="empty">
          {i18n.label.empty}
        </div>
      )}

      {view !== 'grid' && (
        <div className="mb-3">
          <BackButton onClick={() => setView('grid')} />
        </div>
      )}

      <Swiper
        ref={swiper}
        direction="vertical"
        slidesPerView={1}
        spaceBetween={30}
        mousewheel
        modules={[ Mousewheel ]}
        observer
        observeParents
        className={classNames({
          'd-none': view === 'grid',
        })}
      >
        {posts.map((post: any) => (
          <SwiperSlide key={post.id}>
            <PostItemCard
              item={post}
              view={view}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {view !== 'grid' && (
        <div className="swiper-controls">
          <Button className="btn-swiper" onClick={() => swiper.current?.swiper.slidePrev()}>
            <CaretUpIcon />
          </Button>
          <Button className="btn-swiper" onClick={() => swiper.current?.swiper.slideNext()}>
            <CaretDownIcon />
          </Button>
        </div>
      )}

      <InfiniteScroll
        dataLength={posts.length}
        next={() => loadData(false, '', filters)}
        hasMore={active && meta.currentPage < meta.nextPage}
        loader={renderPlaceholder()}
        className={classNames('row row-gap-4', {
          'd-none': view !== 'grid',
        })}
      >
        {posts.map((post: any, i: number) => (
          <Col key={post.id} lg={4} md={6} onClick={() => toggleView(i)}>
            <PostItemCard
              item={post}
              view={view}
            />
          </Col>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default DiscoverTab;
