import './MyEvents.scss';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'reactstrap';

import { IRootState } from '@app/store';
import { getMyEventsRequest } from '@reducers/event/EventAction';
import { handleError } from '@services/ErrorHandler';
import SortButton from '@shared/buttons/SortButton';
import { Pagination } from '@shared/components/pagination';
import useTranslation from '@shared/hooks/useTranslation';
import { FilterIcon } from '@shared/icons';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

import { Empty } from './components/empty';
import EventCard from './components/event-card/EventCard';

function MyEvents() {
  const i18n = useTranslation('contentManager');
  const dispatch = useDispatch<any>();
  const myEvents = useSelector((state: IRootState) => state.Event.events);
  const account = useSelector((state: IRootState) => state.Auth.account);
  const [ selectedSort, setSelectedSort ] = useState('latest-to-oldest');
  const [ selectedFilter, setSelectedFilter ] = useState('all');
  const [ currentPage, setCurrentPage ] = useState<string | number>(1);
  const [ search, setSearch ] = useState('');
  const sortItems = [
    {
      label: i18n.events.latestToOldest,
      value: 'latest-to-oldest',
    },
    {
      label: i18n.events.oldestToLatest,
      value: 'oldest-to-latest',
    },
  ];

  const filters = [
    {
      label: i18n.events.all,
      value: 'all',
    },
    {
      label: i18n.events.ongoing,
      value: 'ongoing',
    },
    {
      label: i18n.events.upcoming,
      value: 'upcoming',
    },
    {
      label: i18n.events.completed,
      value: 'completed',
    },
  ];

  // eslint-disable-next-line no-confusing-arrow
  const getSelectedSort = () => selectedSort === 'latest-to-oldest' ? i18n.events.latestToOldest : i18n.events.oldestToLatest;

  const getQuery = () => {
    let ownerableType = account?.type;

    if (ownerableType === 'user') {
      ownerableType = 'Client';
    }

    if (ownerableType === 'organization') {
      ownerableType = 'Organization';
    }

    let query = {
      ownerable_id: account.id,
      ownerable_type: ownerableType,
      limit: 4,
      page: currentPage,
      sort: 'DESC',
      search,
      filter: selectedFilter,
    };

    query = {
      ...query,
      sort: selectedSort === 'latest-to-oldest' ? 'DESC' : 'ASC',
    };

    return query;
  };

  const fetchMyEvents = async () => {
    try {
      const query = getQuery();
      await dispatch(getMyEventsRequest(query)).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ search, selectedFilter, selectedSort, currentPage, account ]);

  return (
    <Container fluid className="my-events">
      <div className="header">
        <h2>{i18n.label.myEvents}</h2>
        <div className="event-filters">
          <SortButton
            sortIcon={<FilterIcon />}
            onSelect={(item) => setSelectedFilter(item.value)}
            items={filters}
            label={(i18n.events as any)[selectedFilter]}
          />
          <SortButton
            onSelect={(item) => setSelectedSort(item.value)}
            items={sortItems}
            label={getSelectedSort()}
          />
          <SearchBar onSearch={(keyword) => setSearch(keyword)} />
        </div>
      </div>
      {myEvents?.meta?.totalItems > 0
        ? (
          <React.Fragment>
            <div className="events-grid">
              {myEvents?.items?.map((event: any) => (
                <EventCard
                  key={event?.id}
                  event={event}
                  query={getQuery()}
                />
              ))}
            </div>

            <Pagination
              meta={myEvents?.meta as any}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </React.Fragment>
        )
        : (
          <Empty />
        )}
    </Container>
  );
}

export default MyEvents;
