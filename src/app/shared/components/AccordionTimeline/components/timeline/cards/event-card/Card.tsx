/* eslint-disable camelcase */
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { dateToCalendar, dateToTime, getProfileLink } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@shared/icons';
import ImagePlaceholder from '@shared/utils/ImagePlaceholder/ImagePlaceholder';
import { ImageType, LocationType } from 'types';

import PostCard from './PostCard';

interface CardProps {
  id?: string;
  name?: string;
  description?: string;
  started_at: Date;
  ended_at: Date;
  location: LocationType;
  banner_url: ImageType;
  posts: any[];
  owner: any;
  coCreators: any[];
}

function Card({
  id,
  name,
  description,
  started_at,
  ended_at,
  location,
  banner_url,
  posts,
  owner = {},
  coCreators,
}: CardProps) {
  const i18n = useTranslation('home');
  const eventsScroll = useRef<any | HTMLDivElement>(null);
  const [ isDragging, setIsDragging ] = useState(false);
  const [ startX, setStartX ] = useState(0);
  const [ scrollLeft, setScrollLeft ] = useState(0);
  const [ openPosts, setOpenPosts ] = useState(true);

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

  return (
    <div className="event-card" id={id}>
      <div className="header">
        {
          ended_at !== null
            ? <div className="b6 date">{dateToCalendar(started_at)}, {dateToTime(started_at)} - {dateToTime(ended_at)}</div>
            : <div className="b6 date">{dateToCalendar(started_at)}, {dateToTime(started_at)}</div>
        }
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenPosts(!openPosts)}>
          <ArrowDownIcon />
        </div>
      </div>
      <div className={classNames('body', { 'border-bottom-0': !posts.length || posts.length === 0 })}>
        <NavLink to={`/events/${id}`} className="stretched-link" />
        {banner_url ? (
          <img src={banner_url?.md} alt="" className="image" />
        ) : (
          <ImagePlaceholder className="image" width="50%" />
        )}
        <div className="informative">
          <div className="b2">{name}</div>
          <div className="b5 description">{description}</div>
          <div className="caption1 location">{location?.name}</div>

          <div className="co-owner-container">
            {(coCreators?.length > 0 || owner?.name || owner?.display_name) && (
              <div className="caption1 co-owner">
                {i18n.label.organizedBy}&nbsp;

                <NavLink key={owner?.id} to={getProfileLink(owner)} className="link">
                  {owner?.name || owner?.display_name }
                </NavLink>

                {coCreators?.length > 0 && ', '}
                {coCreators?.map?.((c: any, index: number) => (
                  <>
                    <NavLink key={c?.creator?.id} to={c?.creator?.link} className="link">
                      {c?.creator?.name}
                    </NavLink>
                    {index < coCreators.length - 1 && ', '}
                  </>
                ))}
              </div>
            )}

            {openPosts && (
              <div className="slider-button">
                <div className="arrow" onClick={() => scroll(-342)}>
                  <ChevronLeftIcon />
                </div>
                <div className="arrow" onClick={() => scroll(342)}>
                  <ChevronRightIcon />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {(openPosts && posts?.length > 0) && (
        <div className="footer">
          <div
            className="post-slider"
            ref={eventsScroll}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp} // Stop dragging when leaving the container
          >
            {posts?.map((post: any) => (
              <PostCard key={post?.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
