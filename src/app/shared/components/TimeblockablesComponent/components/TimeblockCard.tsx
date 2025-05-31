import classNames from 'classnames';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Button, Card, DropdownItem, DropdownMenu, DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import './TimeblockCard.scss';

import { IRootState } from '@app/store';
import { createTimelineTimelockRequest, deleteTimeblockableRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { AddTimelineModal } from '@shared/components/Modal/AddTimelineModal';
import { dateToCalendar, dateToTime } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import {
  OrganizationIcon,
} from '@shared/icons';
import Add from '@shared/icons/Add';
import ArrowDown from '@shared/icons/ArrowDown';
import ArrowLeft from '@shared/icons/ArrowLeft';
import ArrowRight from '@shared/icons/ArrowRight';
import ArrowUp from '@shared/icons/ArrowUp';
import EventIcon from '@shared/icons/EventIcon';
import TimelineIcon from '@shared/icons/TimelineIcon';

import TimeblockPin from './TimeblockPin';

interface TimeblockCardProps {
  rootId: string;
  data: any;
  activeCard: string;
  onClick: (timeblock: any) => void;
  request: () => void;
  moveTimeblocks: (direction: string, item: any) => void;
  viewOnly?: boolean;
  setActiveCard: (id: string) => void;
  hasExtender?: boolean;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

function TimeblockCard({
  rootId,
  data,
  activeCard,
  onClick,
  request,
  moveTimeblocks,
  viewOnly,
  setActiveCard,
  hasExtender,
  canMoveLeft,
  canMoveRight,
  canMoveUp,
  canMoveDown,
}: TimeblockCardProps) {
  const i18n = useTranslation('timeblockables');
  const dispatch = useDispatch<any>();
  const [ showModal, setShowModal ] = useState(false);
  const [ isModalSubmitting, setIsModalSubmitting ] = useState(false);
  const account = useSelector((state: IRootState) => state.Auth.account);

  const getDate = () => {
    if (data.type === 'Event') {
      return `${dateToCalendar(data.started_at)}, ${dateToTime(data.started_at)}`;
    }
    return dateToCalendar(data.started_at);
  };

  const getBadge = () => {
    let icon = (<OrganizationIcon className="badge_icon" />);

    if (data.type === 'Event' || data.type === 'Parent Event') {
      icon = (<EventIcon className="badge_icon" />);
    }

    if (data.type === 'Timeline' || data.type === 'Parent Timeline') {
      icon = (<TimelineIcon />);
    }

    return (
      <React.Fragment>
        {icon}
        <span className="caption2">{data.type}</span>
      </React.Fragment>
    );
  };

  const getCoCreators = () => {
    if (data.coCreators && data.coCreators?.length > 0) {
      return (
        <span className="timeblock_card__cocreators">
          <span className="caption1">Organized By: </span>
          {data.coCreators.map((coCreator: any) => (
            <Link
              className="mx-1 caption1"
              key={coCreator?.id}
              to={coCreator?.creator?.link}
            >
              {coCreator?.creator?.name}
            </Link>
          ))}
        </span>
      );
    }

    return null;
  };

  const getLocation = () => {
    if (!data.followers_count && !data.location) {
      return null;
    }

    if (data.followers_couunt && !data.location) {
      return (
        <div className="mt-1 timeblock_card__followers">{data.followers_count} {LocaleService.getPluralizedTranslation(
          i18n.label.follower,
          data.followers_count,
          false,
        )}
        </div>
      );
    }

    if ((data.type === 'Organization' || data.type === 'Parent Organization') && data.location) {
      return (
        <div className="mt-1 d-flex align-items-center gap-1">
          <div className="timeblock_card__location caption1">{data.followers_count} {LocaleService.getPluralizedTranslation(
            i18n.label.follower,
            data.followers_count,
            false,
          )}
          </div>
          <span className="timeblock_card__location caption1">•</span>
          <div className="timeblock_card__location caption1">{data.location?.name}</div>
        </div>
      );
    }

    return (
      <div className="mt-1 timeblock_card__location caption1">{data.location?.name}</div>
    );
  };

  const handleModalSubmit = async (card: any, type: any) => {
    try {
      setIsModalSubmitting(true);
      const requestData = {
        root_timeline_id: rootId,
        parent_timeblockable_id: data.id,
        parent_timeblockable_type: data.type,
        child_timeblockable_id: card,
        child_timeblockable_type: type,
      };

      const response = await dispatch(createTimelineTimelockRequest(requestData)).$promise;
      setActiveCard(response?.data?.id);
      request();
    } catch (error) {
      handleError(error);
    } finally {
      setIsModalSubmitting(false);
      setShowModal(false);
    }
  };

  const handleDeleteTimeblock = async () => {
    try {
      await dispatch(deleteTimeblockableRequest(data.id)).$promise;
      request();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="w-100 timeblock_card">
        <TimeblockPin hasExtender={hasExtender} />
        <Card
          className={classNames({
            active: data.id === activeCard && !viewOnly,
          })}
          onClick={() => onClick(data)}
        >
          <div className="b6 timeblock_card__date">{getDate()}</div>
          <div className="b2 mt-3 timeblock_card__name text-truncate">{data.name}</div>
          <div className="b5 mt-1 timeblock_card__description text-truncate">{data.description}</div>
          {getLocation()}
          <div className="caption1 mt-1 timeblock_card__cocreators">{getCoCreators()}</div>
          <div className="mt-3 d-flex justify-content-between align-items-center flex-wrap">
            <span className="timeblock_card__badge">{getBadge()}</span>
            {data.id === activeCard && !viewOnly && !data.type.includes('Parent') && data?.owner_id === account?.id && (
              <Button color="link" className="text-danger" onClick={handleDeleteTimeblock}>{i18n.label.delete}</Button>
            )}
          </div>
          {data.id === activeCard
          && data?.owner_id === account?.id
          && data.parent_id
          && !viewOnly
          && (canMoveRight || canMoveDown || canMoveLeft || canMoveUp)
          && (
            <div className="mt-3 pt-2 timeblock_card__controls">
              {canMoveRight && (
                <Button className="controls_button" color="link" onClick={() => moveTimeblocks('right', data)}>
                  <ArrowRight />
                  <span className="caption1">{i18n.label.moveRight}</span>
                </Button>
              )}
              {canMoveLeft && (
                <Button className="controls_button" color="link" onClick={() => moveTimeblocks('left', data)}>
                  <ArrowLeft />
                  <span className="caption1">{i18n.label.moveLeft}</span>
                </Button>
              )}
              {canMoveUp && (
                <Button className="controls_button" color="link" onClick={() => moveTimeblocks('up', data)}>
                  <ArrowUp />
                  <span className="caption1">{i18n.label.moveUp}</span>
                </Button>
              )}
              {canMoveDown && (
                <Button className="controls_button" color="link" onClick={() => moveTimeblocks('down', data)}>
                  <ArrowDown />
                  <span className="caption1">{i18n.label.moveDown}</span>
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
      <div className="add_timeblock w-100 mb-4 mt-2">
        {data.id === activeCard && !viewOnly && (
          <UncontrolledDropdown className="add_timeblock__dropdown">
            <DropdownToggle>
              <Button className="add_timeblock__button" color="link">
                <Add />
                <span className="b6">{i18n.label.addATimeBlock}</span>
              </Button>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setShowModal(true)}>
                <EventIcon />
                <span>{i18n.label.event}</span>
              </DropdownItem>
              <DropdownItem onClick={() => setShowModal(true)}>
                <OrganizationIcon />
                <span>{i18n.label.organization}</span>
              </DropdownItem>
              <DropdownItem onClick={() => setShowModal(true)}>
                <TimelineIcon />
                <span>{i18n.label.timeline}</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
      </div>
      <AddTimelineModal
        onSubmit={handleModalSubmit}
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        loading={isModalSubmitting}
      />
    </React.Fragment>
  );
}

export default TimeblockCard;
