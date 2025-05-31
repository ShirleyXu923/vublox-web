import classNames from 'classnames';
import moment from 'moment';
import React, { useState } from 'react';
import { Button } from 'reactstrap';

import useThumbnail from '@shared/hooks/useThumbnail';
import { CalendarIcon, InfoIcon, UserIcon } from '@shared/icons';

import './TimelineMarker.scss';

interface TimelineMarkerProps {
  item: any;
  onSelect: (item: any) => void;
}

function TimelineMarker({ item, onSelect }: TimelineMarkerProps) {
  const [ viewInfo, setViewInfo ] = useState(false);
  const { thumbnail } = useThumbnail(item);

  return (
    <div className={classNames('timeline-marker active')} onClick={() => onSelect(item)}>
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
          <div className="h-100 w-100 d-flex align-items-center justify-content-center">
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
      <div className="caption3">
        {item.name || item.title}
      </div>
      <div className="caret" />
    </div>
  );
}

export default TimelineMarker;
