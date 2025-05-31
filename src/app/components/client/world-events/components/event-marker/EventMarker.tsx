import classNames from 'classnames';
import moment from 'moment';
import React, { useState } from 'react';
import { Button } from 'reactstrap';

import useThumbnail from '@shared/hooks/useThumbnail';
import { CalendarIcon, InfoIcon, UserIcon } from '@shared/icons';
// import ImagePlaceholder from '@shared/utils/ImagePlaceholder/ImagePlaceholder';

import './EventMarker.scss';

interface EventMarkerProps {
  item: any;
}

function EventMarker({ item }: EventMarkerProps) {
  const [ viewInfo, setViewInfo ] = useState(false);
  // const image = item.banner || item.cover_image || item.preview_image_urls || item.logo;
  const { thumbnail } = useThumbnail(item);

  return (
    <div className={classNames('event-marker active')}>
      <div className="banner-img">
        {viewInfo ? (
          <div className="info">
            {item.owner && (
              <div className="d-inline">
                <UserIcon className="me-1" />
                {item.owner?.full_name || item.owner?.name}
              </div>
            )}
            <div className="d-flex align-items-center">
              <CalendarIcon className="me-1" />
              {moment(item.start_date).format('DD MMM, YYYY')}
            </div>
          </div>
        ) : (
          <div className="h-100 thumbnail">
            {thumbnail}
          </div>
        )}
      </div>

      <Button
        color="link"
        size="sm"
        className="p-0"
        onClick={(e) => {
          e.stopPropagation();
          setViewInfo(s => !s);
        }}
      >
        <InfoIcon width={16} className={classNames({ active: viewInfo })} />
      </Button>
      <div className="caption3 m-2 title">
        {item.name || item.title}
      </div>
      <div className="caret" />
    </div>
  );
}

export default EventMarker;
