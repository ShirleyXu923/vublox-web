/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';

import LocaleService from '@services/LocaleService';
import FilterButton from '@shared/buttons/FilterButton';
import SortButton from '@shared/buttons/SortButton';
import { CalendarIcon } from '@shared/icons';
import TuneIcon from '@shared/icons/TuneIcon';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

import CreatePostButton from './CreatePostButton';
import TimelineGroup from '../cards/TimelineGroup';

interface TimeScaleType {
  label: string;
  value: string;
}

interface SortType {
  label: string;
  value: string;
}

interface PublicTimelineProps {
  timeblocks: any
  updateFilter: (sort: string, timeScale: string, filter: string[], search: string) => void;
}

function PublicTimeline({ timeblocks, updateFilter }: PublicTimelineProps) {
  const i18n = LocaleService.getTranslations('timelinePage');
  const [ selectedSort, setSelectedSort ] = useState('latest-to-oldest');
  const [ selectedTimeScale, setSelectedTimeScale ] = useState('10-y');
  const [ filter, setFilter ] = useState<string[]>([ 'all' ]);
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

  const [ yearItems ] = useState<TimeScaleType[]>([
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

  const onSelectTimeScale = (item: TimeScaleType) => {
    setSelectedTimeScale(item?.value);
  };

  const onSelectSort = (item: SortType) => {
    setSelectedSort(item?.value);
  };

  const onSelectFilter = (f: string[]) => {
    setFilter(f);
  };

  const onSearch = (k: string) => {
    updateFilter(selectedSort, selectedTimeScale, filter, k);
  };

  useEffect(() => {
    updateFilter(selectedSort, selectedTimeScale, filter, '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ selectedSort, selectedTimeScale, filter ]);

  return (
    <Col className="timeline">
      <div className="header">
        <Row>
          <Col md={11}>
            <div className="title">
              <div className="s1">{i18n.label.timeline}</div>
              <CreatePostButton link="/posts/create#step-1" />
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: '32px' }}>
          <Col md={11} style={{ width: '100%' }}>
            <div className="filters">
              <FilterButton
                label={i18n.label.filters}
                sortIcon={<TuneIcon />}
                onSelect={onSelectFilter}
              />
              <SortButton
                onSelect={onSelectTimeScale}
                label={i18n.label.tenYears}
                sortIcon={<CalendarIcon />}
                items={yearItems}
              />
              <SortButton
                onSelect={onSelectSort}
                label={i18n.label.latestToOldest}
                items={sortItems}
              />
              <SearchBar onSearch={onSearch} />
            </div>
          </Col>
        </Row>
      </div>
      <div className="content mt-5">
        {/* This is the group year */}
        {timeblocks !== null && selectedSort === 'latest-to-oldest' && (
          <>
            {Object.keys(timeblocks).sort().reverse().map((key: any, index: number) => (
              <TimelineGroup
                key={key}
                year={key}
                timeblocks={timeblocks[key]}
                isLast={timeblocks.length >= index}
              />
            ))}
          </>
        )}
        {timeblocks !== null && selectedSort === 'oldest-to-latest' && (
          <>
            {Object.keys(timeblocks).sort().map((key: any, index: number) => (
              <TimelineGroup
                key={key}
                year={key}
                timeblocks={timeblocks[key]}
                isLast={timeblocks.length >= index}
              />
            ))}
          </>
        )}

      </div>
    </Col>
  );
}

export default PublicTimeline;
