/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
} from 'reactstrap';

import './MyTimeline.scss';
import { IRootState } from '@app/store';
import { getMyTimelinesRequest, unPublishTimelineRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import SortButton from '@shared/buttons/SortButton';
import ConfirmPublishModal from '@shared/components/Modal/ConfirmPublishModal';
import { Pagination } from '@shared/components/pagination';
import useTranslation from '@shared/hooks/useTranslation';
import { VisibilityOffIcon } from '@shared/icons';
import Checkbox from '@shared/utils/Forms/Checkbox/Checkbox';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

import TimelineItem from './components/TimelineItem';
import { Empty } from './components/empty';

function MyTimeline() {
  const i18n = useTranslation('contentManager');
  const dispatch = useDispatch<any>();
  const myTimelines = useSelector((state: IRootState) => state.Timeline.myTimelines);
  const account = useSelector((state: IRootState) => state.Auth.account);
  const [ selectedSort, setSelectedSort ] = useState('latest-to-oldest');
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ search, setSearch ] = useState('');
  const [ sortItems ] = useState([
    {
      label: i18n.timelines.latestToOldest,
      value: 'latest-to-oldest',
    },
    {
      label: i18n.timelines.oldestToLatest,
      value: 'oldest-to-latest',
    },
  ]);
  const [ selectedTimelines, setSelectedTimelines ] = useState<string[]>([]);
  const [ isSelectedAll, setIsSelectedAll ] = useState(false);
  const [ showConfirmModal, setShowConfirmModal ] = useState(false);

  // eslint-disable-next-line no-confusing-arrow
  const getSelectedSort = () => selectedSort === 'latest-to-oldest' ? i18n.timelines.latestToOldest : i18n.timelines.oldestToLatest;

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
      limit: 3,
      page: currentPage,
      sort: 'DESC',
      search,
    };

    query = {
      ...query,
      sort: selectedSort === 'latest-to-oldest' ? 'DESC' : 'ASC',
    };

    return query;
  };

  const getMyTimelines = async () => {
    try {
      const queryParams = getQuery();
      await dispatch(getMyTimelinesRequest(queryParams)).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  const handlePageChange = (page: number | string = 1) => {
    setCurrentPage(page as number);
  };

  const handleSelectChange = (timelineId: string) => {
    if (selectedTimelines.includes(timelineId)) {
      // Remove the timeline id from the selected array
      const removedCopy = selectedTimelines.filter(e => e !== timelineId);
      setSelectedTimelines(removedCopy);
    } else {
      // Add the timeline id to the selected array
      const selectedCopy = selectedTimelines;
      setSelectedTimelines([ ...selectedCopy, timelineId ]);
    }
  };

  const handleSelectAll = () => {
    const timelineIds: string[] = [];

    myTimelines?.items?.map((timeline: any) => {
      if (timeline?.published_at !== null) {
        timelineIds.push(timeline?.id);
      }
      return timeline;
    });

    setSelectedTimelines(timelineIds);
  };

  const handleUnselectAll = () => {
    setSelectedTimelines([]);
  };

  const handleUnpublishTimelines = async () => {
    try {
      const data = {
        timelines: selectedTimelines,
      };
      await dispatch(unPublishTimelineRequest(data)).$promise;
      setSelectedTimelines([]);
      setShowConfirmModal(false);
      getMyTimelines();
    } catch (error: any) {
      handleError(error);
    }
  };

  useEffect(() => {
    setSelectedTimelines([]);
  }, [ myTimelines ]);

  useEffect(() => {
    // Check for the selected all state
    let selectedAll = true;
    myTimelines?.items?.map((timeline: any) => {
      if (!selectedTimelines.includes(timeline?.id)) {
        selectedAll = false;
      }
      return timeline;
    });

    setIsSelectedAll(selectedAll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ selectedTimelines ]);

  useEffect(() => {
    getMyTimelines();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ currentPage, selectedSort, search, account ]);

  return (
    <Container fluid className="my-timelines">
      <div className="header">
        <h2>{i18n.label.myTimelines}</h2>
        <div className="filters">
          <SortButton
            onSelect={(item) => setSelectedSort(item.value)}
            items={sortItems}
            label={getSelectedSort()}
          />
          <SearchBar onSearch={(keyword: string) => setSearch(keyword)} />
        </div>
      </div>
      {myTimelines?.meta?.totalItems > 0
        ? (
          <div className="content">
            <div className="items">
              {selectedTimelines.length > 0 && (
                <div className="has-selected">
                  <div className="label">
                    <div className="b5">{selectedTimelines.length} {i18n.timelines.selected}</div>
                    <div>|</div>
                    <div className="b5 unselect" onClick={handleUnselectAll}>{i18n.timelines.unSelect}</div>
                  </div>
                  <div className="action" onClick={() => setShowConfirmModal(true)}>
                    <VisibilityOffIcon />
                    <span className="b5">{i18n.timelines.unpublish}</span>
                  </div>
                </div>
              )}

              <div className="item">
                <Checkbox onChange={handleSelectAll} checked={isSelectedAll} />
                <div className="select-all-label">{i18n.timelines.selectAll}</div>
              </div>

              {myTimelines?.items?.map((timeline: any) => (
                <div className="item" key={timeline?.id}>
                  <Checkbox
                    disabled={timeline?.published_at === null}
                    onChange={() => handleSelectChange(timeline?.id)}
                    checked={selectedTimelines.includes(timeline?.id)}
                  />
                  <TimelineItem
                    query={getQuery()}
                    timeline={timeline}
                    isSelected={selectedTimelines.includes(timeline?.id)}
                  />
                </div>
              ))}
            </div>
            <Pagination meta={myTimelines?.meta} onPageChange={handlePageChange} />
          </div>
        )
        : (
          <Empty />
        )}
      <ConfirmPublishModal
        title={i18n.timelines.unpublishTimelines}
        description={
          LocaleService.parseTranslation(
            i18n.timelines.unpublishDescription,
            <span className="b3" style={{ color: 'var(--bs-primary)' }}>{selectedTimelines.length}</span>,
          ) as string
        }
        draftButtonText={i18n.timelines.cancel}
        confirmButtonText={i18n.timelines.unpublishTimelines}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleUnpublishTimelines}
        isOpen={showConfirmModal}
        toggle={() => setShowConfirmModal(!showConfirmModal)}
      />
    </Container>
  );
}

export default MyTimeline;
