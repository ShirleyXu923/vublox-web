/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
import classNames from 'classnames';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import LocaleService from '@services/LocaleService';
import FilterButton from '@shared/buttons/FilterButton';
import SortButton from '@shared/buttons/SortButton';
import OffCanvasFilters from '@shared/components/OffCanvasFilters/OffCanvasFilters';
import { ClockIcon } from '@shared/icons';
import TuneIcon from '@shared/icons/TuneIcon';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

import { CreatePostButton } from '../create-button';

import './TimelineHeader.scss';

export interface TimelineHeaderProps {
  sortItems: any[];
  yearItems: any[];
  onSelectTimeScale: (item: any) => void;
  onSelectSort: (item: any) => void;
  onSelectFilter: (item: any) => void;
  createPostLink?: string;
  createEventLink?: string;
  createTimelineLink?: string;
  showFiltersOnly?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  timelineHeaderProps?: any;
  selectedTimeScale: any;
  contributeDisabled?: boolean;
  gameMode?: boolean;
  selectedSort?: 'latest-to-oldest' | 'oldest-to-latest';
  onSearch: (value: string) => void;
  searching: boolean;
  hideContributePost?: boolean;
}

function TimelineHeader({
  sortItems,
  yearItems,
  onSelectTimeScale,
  onSelectSort,
  onSelectFilter,
  createPostLink,
  createEventLink,
  createTimelineLink,
  showFiltersOnly,
  selectedTimeScale,
  contributeDisabled,
  gameMode,
  selectedSort,
  onSearch,
  searching,
  hideContributePost,
}: TimelineHeaderProps) {
  const i18n = LocaleService.getTranslations('accordionTimeline');
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const [ isFixedFilters, setIsFixedFilters ] = useState(false);
  const location = useLocation();
  const showHistorical = location.pathname.startsWith('/profile');

  const handleScroll = () => setIsFixedFilters(window.scrollY > 150);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [ offcanvasOpen, setOffcanvasOpen ] = useState(false); // Offcanvas toggle
  const toggleOffcanvas = () => setOffcanvasOpen(!offcanvasOpen);
  const [ counter, setCounter ] = useState(1);
  const updateCounter = (filterCount: number): void => {
    setCounter(Math.max(0, filterCount));
  };

  const [ selectedFilters, setSelectedFilters ] = useState<string[]>(showHistorical ? [ 'posts', 'personal', 'tagged', 'tags', 'historical' ] : [ 'posts', 'personal', 'tagged', 'tags' ]);

  const selectedTimeScaleLabel = useMemo(() => yearItems.find(item => item.value === selectedTimeScale)?.label || selectedTimeScale, [ selectedTimeScale, yearItems ]);
  const selectedSortLabel = selectedSort === 'oldest-to-latest' ? i18n.label.oldestToLatest : i18n.label.latestToOldest;

  return (
    <>
      <div className="timeline-header-filters">
        <Row className="d-flex align-items-center gx-0">
          <Col className="d-flex justify-content-between">
            <div className="d-flex justify-content-start">
              {/* <div className="s3 me-2">{i18n.label.timeline}</div> */}
              {!contributeDisabled && (
                <CreatePostButton
                  timelineLink={createTimelineLink}
                  eventLink={createEventLink}
                  link={createPostLink}
                  hideContributePost={hideContributePost}
                />
              )}
            </div>
            <div className="d-flex justify-content-end gap-1">
              <SortButton
                onSelect={onSelectTimeScale}
                label={selectedTimeScaleLabel}
                sortIcon={<ClockIcon />}
                items={yearItems}
              />
              <FilterButton
                label={(
                  <span style={{ color: 'var(--bs-secondary-text)' }}>
                    {i18n.label.sortAndFilter}
                    {counter > 0 && (
                      <div className="filter-count ms-1" style={{ display: 'inline-flex' }}>
                        {counter}
                      </div>
                    )}
                  </span>
                )}
                sortIcon={null}
                onSelect={onSelectFilter}
                toggleOffcanvas={toggleOffcanvas}
              />
            </div>
          </Col>
        </Row>
      </div>

      <div
        className={classNames('off-canvas-filters', {
          'd-block': offcanvasOpen, // Bootstrap class for `display: block`
          'd-none': !offcanvasOpen, // Bootstrap class for `display: none`
        })}
      >
        <OffCanvasFilters
          offCanvasOpen={offcanvasOpen}
          toggleOffCanvas={toggleOffcanvas}
          labelSort={selectedSortLabel}
          onSelectFilter={onSelectFilter}
          onSelectTimeScale={onSelectTimeScale}
          yearItems={yearItems}
          onSelectSort={onSelectSort}
          sortItems={sortItems}
          showFiltersOnly={showFiltersOnly && isFixedFilters}
          selectedTimeScale={selectedTimeScale}
          updateCounter={updateCounter}
          onSearch={onSearch}
          searching={searching}
          showHistorical={showHistorical}
          selectedFilters={selectedFilters}
        />
      </div>
    </>
  );
}

export default TimelineHeader;
