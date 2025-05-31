import React, { useState } from 'react';

import './Timeline.scss';
import EventModal from '@shared/components/PreviewModal/EventModal/EventModal';
import OrganizationModal from '@shared/components/PreviewModal/OrganizationModal/OrganizationModal';
import PostModal from '@shared/components/PreviewModal/PostModal/PostModal';
import TimelineModal from '@shared/components/PreviewModal/TimelineModal/TimelineModal';

import CardItem from './components/CardItem';

interface TimelineProps {
  timeblockables: any;
  onChangeVisibleItems?: ((isVisible: boolean, items: any[]) => void);
  timescale: string;
  query?: any;
}

function Timeline({
  timeblockables, onChangeVisibleItems, timescale = '', query = {},
}: TimelineProps) {
  const [ showPost, setShowPost ] = useState(false);
  const [ showEvent, setShowEvent ] = useState(false);
  const [ showTimeline, setShowTimeline ] = useState(false);
  const [ showOrganization, setShowOrganization ] = useState(false);
  const [ selectedPost, setSelectedPost ] = useState<string | undefined>(undefined);
  const [ selectedEvent, setSelectedEvent ] = useState<string | undefined>(undefined);
  const [ selectedTimeline, setSelectedTimeline ] = useState<string | undefined>(undefined);
  const [ selectedOrganization, setSelectedOrganization ] = useState<string | undefined>(undefined);
  const [ value, unit ] = timescale.split('-');

  const navigateToItem = (item: any) => {
    window.open(`/${item.page_type?.toLowerCase()}s/${item.slug || item.id}`, '_blank');
  };

  const handleSelect = (e: any, item: any, type: string) => {
    e.preventDefault();

    if (type?.toLowerCase() === 'post') {
      setSelectedPost(item);
      setShowPost(true);
      return;
    }

    if (type?.toLowerCase() === 'event') {
      setSelectedEvent(item);
      setShowEvent(true);
      return;
    }

    if (type?.toLowerCase() === 'timeline') {
      setSelectedTimeline(item);
      setShowTimeline(true);
      return;
    }

    if (type?.toLowerCase() === 'organization') {
      setSelectedOrganization(item);
      setShowOrganization(true);
      return;
    }

    navigateToItem(item);
  };

  return (
    <div className="timeline-accordion-container">
      <PostModal
        item={selectedPost}
        show={showPost}
        toggle={() => setShowPost(false)}
      />

      <EventModal
        item={selectedEvent}
        show={showEvent}
        toggle={() => setShowEvent(false)}
      />

      <TimelineModal
        item={selectedTimeline}
        show={showTimeline}
        toggle={() => setShowTimeline(false)}
      />

      <OrganizationModal
        item={selectedOrganization}
        show={showOrganization}
        toggle={() => setShowOrganization(false)}
      />

      {timeblockables.map((item: any, index: number) => (
        <CardItem
          key={item?.id || item?.type}
          item={item}
          open
          list={item.items}
          currentIndex={index}
          onChangeVisibleItems={onChangeVisibleItems}
          onClick={handleSelect}
          query={{ ...query, ts_value: value, ts_unit: unit }}
        />
      ))}
    </div>
  );
}

export default Timeline;
