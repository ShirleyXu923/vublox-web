import ContentLoader from 'react-content-loader';
import { useMediaQuery } from 'react-responsive';

import useCurrentLocation from '@shared/hooks/useCurrentLocation';

import AppleMap, { AppleMapProps } from './AppleMap';
import GoogleMap, { GoogleMapProps } from './GoogleMap';
import TimelineSlider from './timeline-slider/TimelineSlider';

import './TimelineMap.scss';

type TimelineMapProps = Omit<GoogleMapProps, 'onSelect'> & Omit<AppleMapProps, 'onSelect'> & {
  loading?: boolean;
  location?: any;
  startDate: Date;
  endDate: Date;
  onSelectTimeRange: (data: any) => void;
};

function TimelineMapPreview({
  loading, location, startDate, endDate, onSelectTimeRange, ...rest
}: TimelineMapProps) {
  const { country } = useCurrentLocation();
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const height = isXsScreen ? 226 : 370;

  const navigateToItem = (item: any) => {
    window.open(`/${item.page_type?.toLowerCase()}s/${item.slug || item.id}`, '_blank');
  };

  const handleSelect = (item: any) => {
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
          <AppleMap {...rest} onSelect={handleSelect} />
        )}
      <TimelineSlider
        startedAt={startDate}
        endedAt={endDate}
        onSelectTimeRange={onSelectTimeRange}
      />
    </div>
  );
}

export default TimelineMapPreview;
