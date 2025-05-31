/* eslint-disable camelcase */
import React, { useRef, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@shared/icons';

import { PostCard } from '../post-card';

interface CardProps {
  title?: string;
  posts?: any | any[];
}

function Card({
  title,
  posts,
}: CardProps) {
  const eventsScroll = useRef<any | HTMLDivElement>(null);
  const [ isDragging, setIsDragging ] = useState(false);
  const [ startX, setStartX ] = useState(0);
  const [ scrollLeft, setScrollLeft ] = useState(0);
  const [ openPosts ] = useState(true);

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
    <div className="post-group-card">
      <div className="header">
        <div className="b6">{title}</div>
        <div className="slider-button">
          <div className="arrow" onClick={() => scroll(-342)}>
            <ChevronLeftIcon />
          </div>
          <div className="arrow" onClick={() => scroll(342)}>
            <ChevronRightIcon />
          </div>
        </div>
      </div>
      {openPosts && (
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
