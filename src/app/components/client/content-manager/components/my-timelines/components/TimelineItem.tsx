import './TimelineItem.scss';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

import { getMyTimelinesRequest, publishTimelineRequest, unPublishTimelineRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import { dateToCalendar } from '@shared/helpers';
import useThumbnail from '@shared/hooks/useThumbnail';
import useTranslation from '@shared/hooks/useTranslation';
import MoreIcon from '@shared/icons/MoreIcon';
import TimelineIcon from '@shared/icons/TimelineIcon';
import { CategoryType, ImageType, LocationType } from 'types';

interface TimelineItemProps {
  timeline: {
    id: string;
    name: string;
    description: string;
    privacy_option: string;
    cover_image: ImageType;
    started_at: Date;
    published_at: Date | null;
    location: LocationType;
    category: CategoryType;
    tags: string[];
  }
  isSelected?: boolean;
  query?: any;
}

function TimelineItem({ timeline, isSelected, query }: TimelineItemProps) {
  const i18n = useTranslation('contentManager');
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [ expanded, setExpanded ] = useState(false);
  const [ showOptions, setShowOptions ] = useState(false);
  const { thumbnail } = useThumbnail(timeline);

  const publishTimeline = async () => {
    try {
      await dispatch(publishTimelineRequest(timeline.id as string)).$promise;
      await dispatch(getMyTimelinesRequest(query)).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  const unpublishTimeline = async () => {
    try {
      const data = {
        timelines: [ timeline?.id ],
      };

      await dispatch(unPublishTimelineRequest(data)).$promise;
      await dispatch(getMyTimelinesRequest(query)).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  return (
    <div className={`timeline-item-card ${isSelected ? 'selected' : ''}`}>
      <UncontrolledDropdown
        className="more-menu"
        direction="end"
      >
        <DropdownToggle>
          <div onClick={() => setShowOptions(!showOptions)}>
            <MoreIcon />
          </div>
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem onClick={() => toast.info(i18n.info.upcoming)}>
            <div className="b5 text-body">{i18n.timelines.boost}</div>
          </DropdownItem>
          <DropdownItem onClick={() => navigate(`/timelines/${timeline?.id}/edit`)}>
            <div className="b5 text-body">{i18n.timelines.edit}</div>
          </DropdownItem>
          {timeline?.published_at === null && (
            <DropdownItem onClick={publishTimeline}>
              <div className="b5 text-body">{i18n.timelines.publish}</div>
            </DropdownItem>
          )}
          {timeline?.published_at !== null && (
            <DropdownItem onClick={unpublishTimeline}>
              <div className="b5 text-body">{i18n.timelines.unpublish}</div>
            </DropdownItem>
          )}
        </DropdownMenu>
      </UncontrolledDropdown>

      <div className="timeline-item">
        <div className="image-default">
          {thumbnail}
        </div>
        <div className="informations">
          <div className="title">
            <Link to={`/timelines/${timeline?.id}`} className={`b4 text-body ${expanded ? 'text-wrap' : 'text-truncate'}`}>{timeline?.name}</Link>
          </div>
          <div className={`b5 description ${expanded ? 'text-wrap' : 'text-truncate'}`}>{timeline?.description}</div>
          <div className="dates">
            <div className="b5">{dateToCalendar(timeline?.started_at)}</div>
            {timeline?.location && (
              <React.Fragment>
                <div className="separator" />
                <Link to={`/locations/${timeline?.location?.slug}`} className="b5">{timeline?.location?.name}</Link>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
      {expanded && (
        <React.Fragment>
          <div className="more-info">
            <div className="category">
              <div className="caption1">{i18n.timelines.category}</div>
              <div className="b3">{timeline?.category?.name}</div>
            </div>
            <div className="privacy">
              <div className="caption1">{i18n.timelines.privacy}</div>
              <div className="b3">{timeline?.privacy_option}</div>
            </div>
          </div>
          <div className="tags">
            <div className="caption1">{i18n.timelines.tags}</div>
            <div className="tag-items">
              {(timeline?.tags || [])?.length <= 0 && <span className="caption1">-</span>}
              {timeline?.tags?.map((tag: string) => (
                <div className="tag-item caption1" key={tag}>{tag}</div>
              ))}
            </div>
          </div>
        </React.Fragment>
      )}
      <div className="actions">
        <Link to="#" onClick={() => setExpanded(!expanded)}>
          {expanded ? i18n.timelines.viewLess : i18n.timelines.viewMore}
        </Link>

        {!timeline.published_at && (
          <Badge className="primary2">
            <TimelineIcon />
            {i18n.timelines.draft}
          </Badge>
        )}
      </div>
    </div>
  );
}

export default TimelineItem;
