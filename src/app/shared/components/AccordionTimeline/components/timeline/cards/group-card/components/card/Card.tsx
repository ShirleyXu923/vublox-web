import React, { useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import ReactVisibilitySensor from 'react-visibility-sensor';
import { AccordionBody, AccordionHeader, UncontrolledAccordion } from 'reactstrap';

import { convertToQueryParams } from '@services/RequestService';
import ViewAll from '@shared/components/ViewAllButton/ViewAll';
import {
  ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon,
} from '@shared/icons';

import EventCard from '../event-card/EventCard';
import OrganizationBioCard from '../organization-bio-card/OrganizationBioCard';
import OrganizationCard from '../organization-card/OrganizationCard';
import OrganizationCoverPhotoCard from '../organization-cover-photo-card/OrganizationCoverPhotoCard';
import OrganizationLocationCard from '../organization-location-card/OrganizationLocationCard';
import OrganizationLogoCard from '../organization-logo-card/OrganizationLogoCard';
import OrganizationNameCard from '../organization-name-card/OrganizationNameCard';
import PostCard from '../post-card/PostCard';
import TimelineCard from '../timeline-card/TimelineCard';

interface CardProps {
  id: string;
  title?: string;
  items?: any | any[];
  onChangeVisibleItems?: ((isVisible: boolean, items: any[]) => void);
  onClick?: (e: any, item: any, type: string) => void;
  query?: any;
}

const cardComponents: any = {
  Post: PostCard,
  Event: EventCard,
  Timeline: TimelineCard,
  Organization: OrganizationCard,
  'Organization.Name': OrganizationNameCard,
  'Organization.CoverPhoto': OrganizationCoverPhotoCard,
  'Organization.Logo': OrganizationLogoCard,
  'Organization.Bio': OrganizationBioCard,
  'Organization.Location': OrganizationLocationCard,
};

function Card({
  id,
  title,
  items,
  onChangeVisibleItems,
  onClick,
  query,
}: CardProps) {
  const location = useLocation();
  const eventsScroll = useRef<any | HTMLDivElement>(null);
  const [ isDragging, setIsDragging ] = useState(false);
  const [ startX, setStartX ] = useState(0);
  const [ scrollLeft, setScrollLeft ] = useState(0);
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const queryParams = convertToQueryParams(query);

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
    <div className="group-card">
      <UncontrolledAccordion
        toggle={() => {}}
        stayOpen
        defaultOpen={[ id ]}
      >
        <AccordionHeader className="p-0 d-flex align-items-center" targetId={id}>
          <ChevronUpIcon />
          <div className="header">
            <div className="b6">{title}</div>
            <div className="slider-button">
              <div
                className="arrow"
                onClick={(e) => {
                  e.stopPropagation();
                  scroll(-342);
                }}
              >
                <ChevronLeftIcon />
              </div>
              <div
                className="arrow"
                onClick={(e) => {
                  e.stopPropagation();
                  scroll(342);
                }}
              >
                <ChevronRightIcon />
              </div>
            </div>
          </div>
        </AccordionHeader>

        <ReactVisibilitySensor
          onChange={(isVisible: boolean) => onChangeVisibleItems?.(isVisible, items)}
          partialVisibility
          minTopValue={300}
          offset={{ top: isXsScreen ? 250 : 500 }}
          scrollCheck
        >
          <AccordionBody className="footer" accordionId={id}>
            <div
              className="post-slider"
              ref={eventsScroll}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp} // Stop dragging when leaving the container
            >
              {items?.map((item: any, index: number) => {
                // Only show first 8 items if there are more than 8
                if (items.length > 8 && index >= 8) return null;

                const Component = cardComponents[item.type];
                return Component ? (
                  <Component
                    key={item?.id}
                    data={item.data}
                    onClick={(e: any) => onClick?.(e, item.data, item.type)}
                  />
                ) : <span>{item.type}</span>;
              })}
              {/* Show ViewAll only if items at least 8 */}
              {items?.length >= 8 && (
                <ViewAll navigateTo={`${location.pathname}/all?tb=${id}&title=${title}&${queryParams}`} />
              )}
            </div>
          </AccordionBody>
        </ReactVisibilitySensor>
      </UncontrolledAccordion>
    </div>
  );
}

export default Card;
