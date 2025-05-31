import React, {
  MouseEvent, ReactElement, useEffect, useRef,
} from 'react';
import { useMediaQuery } from 'react-responsive';

import './ResizableTimeline.scss';
import useAppTheme from '@shared/hooks/useAppTheme';

function ResizableTimeline({ mapComponent, timeline }: {
  mapComponent: ReactElement<any>;
  timeline: ReactElement<any> | null;
}) {
  const id = useRef(Math.floor(Math.random() * (1 + 100 - 1)) + 1);
  const isDragging = useRef(false);
  const isMdScreen = useMediaQuery({ query: '(max-width: 768px)' });
  const { timelineSize, setTimelineSize } = useAppTheme();

  const handleMouseMove = (e: any) => {
    e.preventDefault();
    if (isDragging.current) {
      const dragIndicator = document.getElementById(`drag-indicator-${id.current}`) as HTMLElement;
      dragIndicator.setAttribute('style', `left: ${e.clientX}px`);
    }
  };

  const handleDragStart = (e: MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;

    const column = document.getElementById(`right-column-${id.current}`) as HTMLElement;
    const dragIndicator = document.createElement('div');
    dragIndicator.className = 'drag-indicator';
    dragIndicator.id = `drag-indicator-${id.current}`;
    dragIndicator.style.height = `${column.offsetHeight}px`;
    dragIndicator.style.top = `${column.offsetTop}px`;
    dragIndicator.style.left = `${column.offsetLeft}px`;

    const div = document.getElementById(`resizable-timeline-${id.current}`) as HTMLElement;
    div.appendChild(dragIndicator);

    window.addEventListener('mousemove', handleMouseMove);
  };

  const handleDragEnd = (e: any) => {
    if (isDragging.current) {
      const percentage = Math.min(Math.max((e.pageX / window.innerWidth) * 100, 35), 65);
      const mainPercentage = 100 - percentage;

      const leftColumn = document.getElementById(`left-column-${id.current}`) as HTMLElement;
      leftColumn.style.width = `${percentage}%`;

      const rightColumn = document.getElementById(`right-column-${id.current}`) as HTMLElement;
      rightColumn.style.width = `${mainPercentage}%`;

      setTimelineSize({
        left: `${percentage}%`,
        right: `${mainPercentage}%`,
      });

      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      const dragIndicator = document.getElementById(`drag-indicator-${id.current}`) as HTMLElement;
      const div = document.getElementById(`resizable-timeline-${id.current}`) as HTMLElement;
      div.removeChild(dragIndicator);
    }
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleDragEnd);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isMdScreen) {
      const leftColumn = document.getElementById(`left-column-${id.current}`) as HTMLElement;
      leftColumn.style.width = timelineSize.left || '58.33%';

      const rightColumn = document.getElementById(`right-column-${id.current}`) as HTMLElement;
      rightColumn.style.width = timelineSize.right || '41.67%';
    }
  }, [ isMdScreen, timelineSize.left, timelineSize.right ]);

  return (
    <div className="resizable-timeline" id={`resizable-timeline-${id.current}`}>
      <div style={{ width: isMdScreen ? '50%' : timelineSize.left || '58.33%' }} id={`left-column-${id.current}`} className="left-column">
        {mapComponent}
      </div>
      <div
        className="drag-handle"
        style={{
          cursor: 'ew-resize',
          width: '3px',
          minHeight: '100%',
          zIndex: 99,
        }}
        onMouseDown={handleDragStart}
      />
      <div
        style={{ width: isMdScreen ? '50%' : timelineSize.right || '41.67%' }}
        className="px-md-2 pb-3 right-column"
        id={`right-column-${id.current}`}
      >
        {timeline}
      </div>
    </div>
  );
}

export default ResizableTimeline;
