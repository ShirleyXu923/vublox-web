import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Button, UncontrolledCollapse } from 'reactstrap';

import { IRootState } from '@app/store';
import { moveTimelineCardRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import { getFormData } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { CaretUpIcon } from '@shared/icons';

import TimeblockCard from './components/TimeblockCard';
import './TimeblockablesComponent.scss';

interface TimeblockablesComponentProps {
  rootId: string;
  timeblocks: any;
  request: () => void;
  viewOnly?: boolean;
}

function TimeblockablesComponent({
  rootId, timeblocks, request, viewOnly,
}: TimeblockablesComponentProps) {
  const i18n = useTranslation('createTimeline');
  const [ activeCard, setActiveCard ] = useState('');
  const dispatch = useDispatch<any>();
  const account = useSelector((state: IRootState) => state.Auth.account);
  const [ searchParams ] = useSearchParams();

  const sendMoveRequest = async (data: any) => {
    try {
      const formData = getFormData(data);
      await dispatch(moveTimelineCardRequest(rootId, formData)).$promise;
      request();
    } catch (error) {
      handleError(error);
    }
  };

  const canMoveLeft = (data: any) => {
    let parent: any = null;

    const finder = (id: string, items: any) => {
      items.forEach((item: any) => {
        if (id === item.id) {
          parent = item;
        }
        finder(id, item.children);
      });
    };

    finder(data.parent_id, timeblocks);

    if (!parent || parent?.type === 'Parent Timeline') return false;

    return true;
  };

  const canMoveRight = (data: any) => {
    let previousSibling: any = null;

    const finder = (id: string, items: any) => {
      items.forEach((item: any, index: number) => {
        if (id === item.id) {
          previousSibling = items[index - 1];
        }
        finder(id, item.children);
      });
    };

    finder(data.id, timeblocks);

    if (!previousSibling) return false;

    return true;
  };

  const canMoveUp = (data: any) => {
    let previousParent: any = null;

    const finder = (id: string, items: any) => {
      items.forEach((item: any, index: number) => {
        if (id === item.id) {
          previousParent = items[index - 1];
        }
        finder(id, item.children);
      });
    };

    finder(data.parent_id, timeblocks);

    if (!previousParent) return false;

    return true;
  };

  const canMoveDown = (data: any) => {
    let nextParent: any = null;

    const finder = (id: string, items: any) => {
      items.forEach((item: any, index: number) => {
        if (id === item.id) {
          nextParent = items[index + 1];
        }
        finder(id, item.children);
      });
    };

    finder(data.parent_id, timeblocks);

    if (!nextParent) return false;

    return true;
  };

  const moveLeft = async (data: any) => {
    let parent: any = null;

    const finder = (id: string, items: any) => {
      items.forEach((item: any) => {
        if (id === item.id) {
          parent = item;
        }
        finder(id, item.children);
      });
    };

    finder(data.parent_id, timeblocks);

    if (!parent || parent?.type === 'Parent Timeline') return;

    const formData = {
      timeblock_id: data.id,
      parent_id: parent?.parent_id,
    };

    await sendMoveRequest(formData);
  };

  const moveRight = async (data: any) => {
    let previousSibling: any = null;

    const finder = (id: string, items: any) => {
      items.forEach((item: any, index: number) => {
        if (id === item.id) {
          previousSibling = items[index - 1];
        }
        finder(id, item.children);
      });
    };

    finder(data.id, timeblocks);

    if (!previousSibling) return;

    const formData = {
      timeblock_id: data.id,
      parent_id: previousSibling?.id,
    };

    await sendMoveRequest(formData);
  };

  const moveUp = async (data: any) => {
    let previousParent: any = null;

    const finder = (id: string, items: any) => {
      items.forEach((item: any, index: number) => {
        if (id === item.id) {
          previousParent = items[index - 1];
        }
        finder(id, item.children);
      });
    };

    finder(data.parent_id, timeblocks);

    if (!previousParent) return;

    const formData = {
      timeblock_id: data.id,
      parent_id: previousParent?.id,
    };

    await sendMoveRequest(formData);
  };

  const moveDown = async (data: any) => {
    let nextParent: any = null;

    const finder = (id: string, items: any) => {
      items.forEach((item: any, index: number) => {
        if (id === item.id) {
          nextParent = items[index + 1];
        }
        finder(id, item.children);
      });
    };

    finder(data.parent_id, timeblocks);

    if (!nextParent) return;

    const formData = {
      timeblock_id: data.id,
      parent_id: nextParent?.id,
    };

    await sendMoveRequest(formData);
  };

  const moveTimeblocks = async (direction: string, data: any) => {
    if (!data.parent_id || data?.owner_id !== account?.id) {
      return;
    }

    if (direction === 'left') {
      await moveLeft(data);
    }

    if (direction === 'right') {
      await moveRight(data);
    }

    if (direction === 'up') {
      await moveUp(data);
    }

    if (direction === 'down') {
      await moveDown(data);
    }
  };

  const haveExtender = (data: any) => {
    if (timeblocks.type?.includes('Parent')) return false;

    let previousSibling: any = null;

    const finder = (id: string, items: any) => {
      items.forEach((item: any, index: number) => {
        if (id === item.id) {
          previousSibling = items[index - 1];
        }
        finder(id, item.children);
      });
    };

    finder(data.id, timeblocks);

    if (previousSibling?.children?.length > 0) return false;

    return true;
  };

  const renderTimeblocks = (timeblockables: any) => {
    const items = timeblockables.map((timeblock: any) => (
      <div key={timeblock.id} className={`timeblock-${timeblock.id}`}>
        <TimeblockCard
          hasExtender={haveExtender(timeblock)}
          rootId={rootId}
          request={request}
          data={timeblock}
          activeCard={activeCard}
          onClick={(data: any) => setActiveCard(data.id)}
          moveTimeblocks={moveTimeblocks}
          viewOnly={viewOnly}
          setActiveCard={setActiveCard}
          canMoveLeft={canMoveLeft(timeblock)}
          canMoveRight={canMoveRight(timeblock)}
          canMoveUp={canMoveUp(timeblock)}
          canMoveDown={canMoveDown(timeblock)}
        />
        {timeblock.children && timeblock.children?.length > 0 && (
          <div className="timeblockable_component__children">
            {timeblock.children?.length > 1 ? (
              <>
                <Button
                  id={`toggle-content-${timeblock.id}`}
                  className="toggler-content mb-3 mt-n2"
                  color="primary"
                >
                  <CaretUpIcon />
                  <span className="show-content">{i18n.button.showContent}</span>
                  <span className="hide-content">{i18n.button.hideContent}</span>
                </Button>
                <UncontrolledCollapse defaultOpen toggler={`toggle-content-${timeblock.id}`}>
                  {renderTimeblocks(timeblock.children)}
                </UncontrolledCollapse>
              </>
            ) : renderTimeblocks(timeblock.children)}
          </div>
        )}
      </div>
    ));

    return items;
  };

  useEffect(() => {
    const dataId = searchParams.get('data_id');
    let timeblockId = null;
    const finder = (items: any) => {
      items.forEach((item: any) => {
        if (item.data_id === dataId) {
          timeblockId = item.id;
        }

        finder(item.children);
      });
    };

    if (dataId) {
      finder(timeblocks);
    }

    if (timeblocks && timeblocks?.length > 0) {
      setActiveCard(timeblockId || timeblocks?.[0]?.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-100 timeblockable_component">
      {renderTimeblocks(timeblocks)}
    </div>
  );
}

export default TimeblockablesComponent;
