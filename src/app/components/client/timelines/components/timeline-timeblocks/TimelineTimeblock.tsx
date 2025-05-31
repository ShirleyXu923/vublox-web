/* eslint-disable @typescript-eslint/no-use-before-define */
import './TimelineTimeblock.scss';

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
import {
  createTimelineTimelockRequest,
  getTimelineTimeblockablesRequest,
  moveTimelineCardRequest,
  publishTimelineRequest,
} from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { AddTimelineModal } from '@shared/components/Modal/AddTimelineModal';
import ConfirmPublishModal from '@shared/components/Modal/ConfirmPublishModal';
import { getFormData } from '@shared/helpers';

import AddTimeblock from './AddTimeblock';
import TimeCard from './TimeCard';
import { TimelineLoader } from '../timeline-loader';

interface TimelineTimeblockProps {
  selectedSort?: string;
}

function TimelineTimeblock({ selectedSort = 'latest-to-oldest' }: TimelineTimeblockProps) {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch<any>();
  const [ showModal, setShowModal ] = useState(false);
  const [ showConfirmModal, setShowConfirmModal ] = useState(false);
  const i18n = LocaleService.getTranslations('createTimeline');
  const { timeblockables } = useSelector((state: IRootState) => state.Timeline);
  const [ timelines, setTimelines ] = useState<any[]>([]);
  const [ parentId, setParentId ] = useState('');
  const [ parentType, setParentType ] = useState('');
  const [ loading, setLoading ] = useState(true);

  const handleCardMove = async (direction: string, data: any) => {
    const {
      currentCard,
      prevSibling,
      parent,
      parentPrevSibling,
      parentNextSibling,
    } = data;

    let blockData = {
      timeblock_id: currentCard?.id,
      parent_id: null,
    };

    if (direction === 'left') {
      blockData = {
        ...blockData,
        parent_id: parent?.parent_timeblockable_id,
      };
    }

    if (direction === 'right') {
      blockData = {
        ...blockData,
        parent_id: prevSibling?.id,
      };
    }

    if (direction === 'up') {
      blockData = {
        ...blockData,
        parent_id: parentPrevSibling?.id,
      };
    }

    if (direction === 'down') {
      blockData = {
        ...blockData,
        parent_id: parentNextSibling?.id,
      };
    }

    try {
      const formData = getFormData(blockData);
      await dispatch(moveTimelineCardRequest(params.id, formData)).$promise;
      toast.success(i18n.success.timelineCardMoved);
      reloadTimelines();
    } catch (error: any) {
      handleError(error);
    }
  };

  const getCard: any = (
    item: any, width: number, entity: any, onMove: any, isRoot = false, parentTimeline = false) => {
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
          onMove={(direction: string) => onMove(direction)}
        />
        {(parentId === item?.id) && (
          <div className="add-timeblock-container">
            <AddTimeblock setShowModal={setShowModal} />
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
    const query = getQuery();
    await dispatch(getTimelineTimeblockablesRequest(params.id as string, query)).$promise;
    // Append the root
    const newTimelines = [];
    const currentWidth = 93;
    newTimelines.push(
      getCard(timeblockables?.root, currentWidth, timeblockables?.root, null, true, true),
    );

    // Append parents
    timeblockables?.timeline?.forEach((item: any, i: number) => {
      const childWidth = currentWidth - 6;
      const timeblock: any = timeblockables?.timeline[i - 1];
      let moveData = {
        currentCard: item,
        prevSibling: timeblock,
        parent: timeblockables?.root,
        parentPrevSibling: null,
        parentNextSibling: null,
      };
      if (timeblock?.children?.length > 0) {
        newTimelines.push(
          getCard(
            item, childWidth, item?.entity, (dir: string) => handleCardMove(dir, moveData), true),
        );
      } else {
        newTimelines.push(
          getCard(item, childWidth, item?.entity, (dir: string) => handleCardMove(dir, moveData)),
        );
      }

      // Append any child
      if (item?.children?.length > 0) {
        item?.children?.forEach((child: any, index: number) => {
          const width = childWidth - 6;
          const timeblockChild = item?.children[index - 1];
          moveData = {
            currentCard: child,
            prevSibling: timeblockChild,
            parent: item,
            parentPrevSibling: timeblockables?.timeline[i - 1],
            parentNextSibling: timeblockables?.timeline[i + 1],
          } as any;
          if (timeblockChild?.children?.length > 0) {
            newTimelines.push(
              getCard(
                child, width, child?.entity, (dir: string) => handleCardMove(dir, moveData), true),
            );
          } else {
            newTimelines.push(
              getCard(child, width, child?.entity, (dir: string) => handleCardMove(dir, moveData)),
            );
          }

          if (child?.children?.length > 0) {
            const grandChildWidth = width - 6;
            child?.children?.forEach((grandChild: any, k: number) => {
              moveData = {
                currentCard: grandChild,
                prevSibling: child?.children[k - 1],
                parent: child,
                parentPrevSibling: child?.children[index - 1],
                parentNextSibling: child?.children[index + 1],
              } as any;
              newTimelines.push(
                getCard(
                  grandChild,
                  grandChildWidth,
                  grandChild?.entity,
                  (dir: string) => handleCardMove(dir, moveData),
                ),
              );
            });
          }
        });
      }
    });

    setTimelines(newTimelines);
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
        parent_timeblockable_type: parentType,
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

  useEffect(() => {
    reloadTimelines();
    setParentType('Timeline');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ selectedSort ]);

  useEffect(() => {
    // Fetch timeblockables
    fetchTimelines();

    hideTopExtender();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ parentId, parentType ]);

  return (
    <Container className="timelines-main-container">
      <Container>
        {loading
          ? <TimelineLoader />
          : (
            <Row className="flex justify-content-center">
              <Col md={11}>
                <div className="timelines-container">
                  {timelines}
                </div>
              </Col>
              <Col md={11} style={{ display: 'none' }}>
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
          )}
      </Container>
      <ConfirmPublishModal
        title={i18n.label.confirmPublishModalTitle}
        description={i18n.label.confirmPublishModalDescription}
        confirmButtonText={i18n.button.publishTimeline}
        draftButtonText={i18n.button.confirmPublishModalDraft}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={publishTimeline}
        isOpen={showConfirmModal}
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

export default TimelineTimeblock;
