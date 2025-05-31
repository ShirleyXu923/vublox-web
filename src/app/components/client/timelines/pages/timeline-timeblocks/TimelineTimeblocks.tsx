import './TimelineTimeblocks.scss';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { createTimelineTimelockRequest, getTimelineTimeblockablesRequest, publishTimelineRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import SkipButton from '@shared/buttons/SkipButton';
import SortButton from '@shared/buttons/SortButton';
import { AddTimelineModal } from '@shared/components/Modal/AddTimelineModal';
import ConfirmPublishModal from '@shared/components/Modal/ConfirmPublishModal';

import AddTimeblock from './AddTimeblock';
import TimeCard from './TimeCard';
import { TimelineLoader } from '../../components/timeline-loader';
import { TimelineTimeblock } from '../../components/timeline-timeblocks';

function TimelineTimeblocks() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch<any>();
  const [ showModal, setShowModal ] = useState(false);
  const [ showConfirmModal, setShowConfirmModal ] = useState(false);
  const i18n = LocaleService.getTranslations('createTimeline');
  const { timeblockables } = useSelector((state: IRootState) => state.Timeline);
  const [ parentId, setParentId ] = useState('');
  const [ parentType, setParentType ] = useState('');
  const [ selectedSort, setSelectedSort ] = useState('');
  const [ loading, setLoading ] = useState(true);
  const [ sortItems ] = useState([
    {
      label: i18n.label.latestToOldest,
      value: 'latest-to-oldest',
    },
    {
      label: i18n.label.oldestToLatest,
      value: 'oldest-to-latest',
    },
  ]);

  // eslint-disable-next-line no-confusing-arrow
  const getSelectedSort = () => selectedSort === 'latest-to-oldest' ? i18n.label.latestToOldest : i18n.label.oldestToLatest;

  const getCard: any = (
    item: any, width: number, entity: any, isRoot = false, parentTimeline = false) => {
    const element = (
      <div
        key={item?.id}
        className="timecard"
        style={{ width: `${width}%` }}
      >
        <TimeCard
          isActive={parentId === item?.id}
          data={entity}
          isRoot={isRoot}
          badge={parentTimeline ? 'Parent Timeline' : item?.child_timeblockable_type}
          onClick={() => {
            setParentId(item?.id);

            if (isRoot) {
              setParentType('Timeline');
            } else {
              setParentType(item?.child_timeblockable_type);
            }
          }}
        />
        {(parentId === item?.id) && (
          <div className="add-timeblock-container">
            <AddTimeblock
              setShowModal={setShowModal}
              toggleModal={() => setShowModal(!showModal)}
            />
          </div>
        )}
      </div>
    );

    return element;
  };

  const publishTimeline = async () => {
    try {
      await dispatch(publishTimelineRequest(params.id as string));
      toast.success(i18n.success.timelinePublished);
      navigate(`/timelines/${params.id}`);
    } catch (error: any) {
      toast.error(i18n.errors.publishTimeline);
    }
  };

  const getQuery = () => {
    const query = {
      sort: selectedSort === 'latest-to-oldest' ? 'DESC' : 'ASC',
    };

    return query;
  };

  const fetchTimelines = async () => {
    await dispatch(getTimelineTimeblockablesRequest(params.id as string, getQuery())).$promise;
    // Append the root
    const newTimelines = [];
    const currentWidth = 93;
    newTimelines.push(
      getCard(timeblockables?.root, currentWidth, timeblockables?.root, true, true),
    );

    // Append parents
    timeblockables?.timeline?.forEach((item: any, i: number) => {
      const childWidth = currentWidth - 6;
      const timeblock: any = timeblockables?.timeline[i - 1];
      if (timeblock?.children?.length > 0) {
        newTimelines.push(
          getCard(item, childWidth, item?.entity, true),
        );
      } else {
        newTimelines.push(
          getCard(item, childWidth, item?.entity),
        );
      }

      // Append any child
      if (item?.children?.length > 0) {
        item?.children?.forEach((child: any, index: number) => {
          const width = childWidth - 6;
          const timeblockChild = item?.children[index - 1];
          if (timeblockChild?.children?.length > 0) {
            newTimelines.push(
              getCard(child, width, child?.entity, true),
            );
          } else {
            newTimelines.push(
              getCard(child, width, child?.entity),
            );
          }

          if (child?.children?.length > 0) {
            const grandChildWidth = width - 6;
            child?.children?.forEach((grandChild: any) => {
              newTimelines.push(
                getCard(grandChild, grandChildWidth, grandChild?.entity),
              );
            });
          }
        });
      }
    });
  };

  const reloadTimelines = async (parentid = params.id ?? '') => {
    setLoading(true);
    await fetchTimelines();
    setLoading(false);
    setParentId(parentid);
  };

  const handleModalSubmit = async (selectedCard: string, selectedType: string) => {
    setShowModal(false);
    try {
      const data = {
        root_timeline_id: params.id,
        parent_timeblockable_id: parentId,
        parent_timeblockable_type: parentType ?? 'Timeline',
        child_timeblockable_id: selectedCard,
        child_timeblockable_type: selectedType,
      };

      setParentId('');
      const res = await dispatch(createTimelineTimelockRequest(data)).$promise;
      reloadTimelines(res?.data?.id);
      toast.success(i18n.success.timeblockCreated);
    } catch (error: any) {
      // Error Handler here
      handleError(error);
    }
  };

  const hideTopExtender = () => {
    const button = document.querySelector('.add-timeblock-buttons');
    const parent = button?.parentElement;
    const sibling = parent?.nextSibling;
    if (sibling) {
      const extenderLine = sibling?.firstChild?.childNodes[1] as HTMLElement;
      if (extenderLine) {
        extenderLine.style.display = 'none';
      }
    }
  };

  const updateSelectedSort = (item: any) => {
    setSelectedSort(item?.value);
  };

  useEffect(() => {
    reloadTimelines();
    setParentType('Timeline');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reloadTimelines();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ selectedSort ]);

  useEffect(() => {
    // Fetch timeblockables
    fetchTimelines();

    hideTopExtender();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ parentId, parentType ]);

  return (
    <Container className="main-container timelines-main-container">
      <Container className="px-0 px-md-5 py-4">
        <Row className="flex justify-content-center">
          <Col md={11}>
            <div className="skip-button">
              <SkipButton onClick={() => navigate('/')} />
            </div>
            <div className="header-title">
              <h1 className="text-center">{i18n.title}</h1>
              <SortButton
                onSelect={updateSelectedSort}
                label={getSelectedSort()}
                items={sortItems}
              />
            </div>
          </Col>
          <Col md={11}>
            <div className="">
              {/* {timelines} */}
              {loading
                ? (
                  <TimelineLoader />
                )
                : (
                  <TimelineTimeblock
                    selectedSort={selectedSort}
                  />
                )}
            </div>
          </Col>
          <Col md={11}>
            <div className="action-button">
              <Button onClick={() => navigate('/')} outline color="primary">{i18n.button.saveAsDraft}</Button>
              <Button
                onClick={() => setShowConfirmModal(true)}
                color="primary"
              >
                {i18n.button.publishTimeline}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <ConfirmPublishModal
        title={i18n.label.confirmPublishModalTitle}
        description={i18n.label.confirmPublishModalDescription}
        confirmButtonText={i18n.button.publishTimeline}
        draftButtonText={i18n.button.confirmPublishModalDraft}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={publishTimeline}
        isOpen={showConfirmModal}
        style={{ maxWidth: '637px' }}
        toggle={() => setShowConfirmModal(!showConfirmModal)}
      />

      <AddTimelineModal
        onSubmit={handleModalSubmit}
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
      />
    </Container>
  );
}

export default TimelineTimeblocks;
