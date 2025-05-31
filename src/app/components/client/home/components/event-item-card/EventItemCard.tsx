import moment from 'moment';
import React, {
  MouseEvent, useRef, useState,
} from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavLink } from 'react-router-dom';
import { Button, UncontrolledCollapse } from 'reactstrap';

import PostCard from '@shared/components/AccordionTimeline/components/timeline/cards/event-card/PostCard';
import { getProfileLink } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import {
  ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon,
} from '@shared/icons';
// import ImagePlaceholder from '@shared/utils/ImagePlaceholder/ImagePlaceholder';

import './EventItemCard.scss';

interface EventItemCardProps {
  item: any;
  ad?: any;
  onViewPost: (post: any) => void;
  onViewEvent: (event: any) => void;
}

function EventItemCard({
  item, ad, onViewPost, onViewEvent,
}: EventItemCardProps) {
  const i18n = useTranslation('home');
  const eventsScroll = useRef<any | HTMLDivElement>(null);
  const [ isDragging, setIsDragging ] = useState(false);
  const [ startX, setStartX ] = useState(0);
  const [ scrollLeft, setScrollLeft ] = useState(0);

  const handleMouseDown = (event: any) => {
    setIsDragging(true);
    setStartX(event.pageX - eventsScroll.current.offsetLeft);
    setScrollLeft(eventsScroll.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event: any) => {
    if (!isDragging) return;
    event.preventDefault();
    const x = event.pageX - eventsScroll.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust sensitivity
    eventsScroll.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (scrollOffset: number) => {
    eventsScroll.current?.scrollTo({
      left: eventsScroll.current.scrollLeft + scrollOffset,
      behavior: 'smooth',
    });
  };
  const isSmScreen = useMediaQuery({ query: '(max-width: 575px)' });

  const handleViewEvent = (e: MouseEvent<any>) => {
    e.preventDefault();
    onViewEvent(item);
  };

  return (
    <div className="event-item-card mb-4">
      <NavLink to={`/events/${item.id}`} className="stretched-link" target="_blank" onClick={handleViewEvent} />
      <div className="details">
        <div className="flex-fill">
          <span className="item-title d-flex align-items-start">
            {item.type === 'live' && (
              <span className="live" style={{ marginRight: '8px' }}>
                {i18n.label.live}
              </span>
            )}
            <h5
              className={`${isSmScreen ? 'b6' : 's2'} mt-1 mb-0 `}
            >{item.name}
            </h5>
          </span>

          <div
            className={` ${isSmScreen ? 'pt-1 small-line-height-description' : 'py-1'}`}
          >
            <small className={`b5 ${isSmScreen ? '' : ''}`}>

              {item.location?.name && (
                <>
                  <NavLink to={`/locations/${item.location.slug}`} className="link">
                    {`${item.location.name}`}
                  </NavLink>
                  <span> • </span>
                </>
              )}
              {item.started_at && moment(item.started_at).format('DD MMM YYYY, hh:mm A')}
              {item.started_at && item.ended_at && ' To '}
              {item.ended_at && moment(item.ended_at).format('DD MMM YYYY, hh:mm A')}
            </small>
          </div>
          <div className={`${isSmScreen ? 'm-0 p-0 small-line-height-description' : ''}`}>
            {(item.coCreators?.length > 0 || item.owner) && (
              <small className="b5">
                {i18n.label.organizedBy}&nbsp;
                <NavLink to={getProfileLink(item.owner)} className="link">
                  {item.owner?.name || item.owner?.display_name || item.owner?.full_name}
                </NavLink>
                {/* Add a comma after the owner's name if there's at least one co-creator */}
                {item.coCreators?.length > 0 && ', '}
                {item.coCreators?.length > 0 && (
                  <>
                    {item.coCreators?.length > 1 ? '' : ' '}
                    {item.coCreators.slice(0, 2).map((c: any, index: number) => (
                      <span key={c?.creator?.id}>
                        <NavLink to={c?.creator?.link} className="link">
                          {c?.creator?.name}
                        </NavLink>
                        {index < 1 && index < item.coCreators.length - 1 && ', '}
                      </span>
                    ))}
                    {item.coCreators.length > 2 && (
                      <>
                        {item.coCreators.length >= 3 && ', '}
                        <NavLink to={`/events/${item.id}`}>
                          <span className="text-primary">
                            +{item.coCreators.length - 2}
                          </span>
                        </NavLink>
                      </>
                    )}
                  </>
                )}
              </small>
            )}
          </div>
        </div>
        <div className="d-flex flex-column justify-content-between align-items-end buttons">
          <Button id={`toggler-${item.id}`} className="toggler">
            <ChevronUpIcon />
          </Button>

          <div className="slider-button">
            <Button color="link" className="arrow" onClick={() => scroll(-342)}>
              <ChevronLeftIcon />
            </Button>
            <Button color="link" className="arrow" onClick={() => scroll(342)}>
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
      <UncontrolledCollapse toggler={`toggler-${item.id}`} defaultOpen>
        <hr className="mt-0 mb-0" />

        <div
          className="post-slider"
          ref={eventsScroll}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp} // Stop dragging when leaving the container
        >
          {item.posts?.slice(0, 3).map((post: any) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => onViewPost(post)}
            />
          ))}

          <div className="h-100">
            <img src={ad} width={342} height="100%" alt="Ad" className="ad" />
          </div>

          {item.posts?.slice(3).map((post: any) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => onViewPost(post)}
            />
          ))}

          {item.posts?.length === 6 && (
            <NavLink to={`/events/${item.id}`}>
              <div className="view-all">
                {i18n.button.viewAll} <ArrowRightIcon className="ms-2" />
              </div>
            </NavLink>
          )}
        </div>
      </UncontrolledCollapse>
    </div>
  );
}

export default EventItemCard;
