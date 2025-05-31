import { APILoader } from '@uiw/react-amap';
import React, { useState } from 'react';
import ContentLoader from 'react-content-loader';
import { useMediaQuery } from 'react-responsive';

import appConfig from '@config/app';
import useCurrentLocation from '@shared/hooks/useCurrentLocation';

import AMap, { AMapProps } from './AMap';
import GoogleMap, { GoogleMapProps } from './GoogleMap';
import TimelineSlider from './timeline-slider/TimelineSlider';
import EventModal from '../PreviewModal/EventModal/EventModal';
import OrganizationModal from '../PreviewModal/OrganizationModal/OrganizationModal';
import PostModal from '../PreviewModal/PostModal/PostModal';
import TimelineModal from '../PreviewModal/TimelineModal/TimelineModal';

import './TimelineMap.scss';

type TimelineMapProps = Omit<GoogleMapProps, 'onSelect'> & Omit<AMapProps, 'onSelect'> & {
  loading?: boolean;
  location?: any;
  startDate: Date;
  endDate: Date;
  onSelectTimeRange: (data: any) => void;
};

function TimelineMap({
  loading, location, startDate, endDate, onSelectTimeRange, ...rest
}: TimelineMapProps) {
  const { country } = useCurrentLocation();
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const [ showPost, setShowPost ] = useState(false);
  const [ showEvent, setShowEvent ] = useState(false);
  const [ showTimeline, setShowTimeline ] = useState(false);
  const [ showOrganization, setShowOrganization ] = useState(false);
  const [ selectedPost, setSelectedPost ] = useState<string | undefined>(undefined);
  const [ selectedEvent, setSelectedEvent ] = useState<string | undefined>(undefined);
  const [ selectedTimeline, setSelectedTimeline ] = useState<string | undefined>(undefined);
  const [ selectedOrganization, setSelectedOrganization ] = useState<string | undefined>(undefined);

  const height = isXsScreen ? 226 : 370;

  const navigateToItem = (item: any) => {
    window.open(`/${item.page_type?.toLowerCase()}s/${item.slug || item.id}`, '_blank');
  };

  const handleSelect = (item: any) => {
    if (item.page_type?.toLowerCase() === 'post') {
      setSelectedPost(item);
      setShowPost(true);
      return;
    }

    if (item.page_type?.toLowerCase() === 'event') {
      setSelectedEvent(item);
      setShowEvent(true);
      return;
    }

    if (item.page_type?.toLowerCase() === 'timeline') {
      setSelectedTimeline(item);
      setShowTimeline(true);
      return;
    }

    if (item.page_type?.toLowerCase() === 'organization') {
      setSelectedOrganization(item);
      setShowOrganization(true);
      return;
    }

    navigateToItem(item);
  };

  return loading ? (
    <ContentLoader
      width={900}
      height={height}
      className="content-loader"
      style={{ width: '100%' }}
      preserveAspectRatio="none"
      viewBox={`0 0 900 ${height}`}
    >
      <rect x="0" y="15" width="900" height={height} />
    </ContentLoader>
  ) : (
    <div className="timeline-map">
      {(country !== 'CN' && location?.country_code !== 'CN')
        ? (
          <GoogleMap {...rest} onSelect={handleSelect} />
        )
        : (
          <APILoader
            akey={appConfig.amap.apiKey}
            version="2.0.5"
          >
            <AMap {...rest} onSelect={handleSelect} />
          </APILoader>
        )}
      <TimelineSlider
        startedAt={startDate}
        endedAt={endDate}
        onSelectTimeRange={onSelectTimeRange}
      />

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
    </div>
  );
}

export default TimelineMap;
