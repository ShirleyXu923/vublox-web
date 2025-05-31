import classNames from 'classnames';
import React from 'react';
import Marquee from 'react-fast-marquee';
import { useMediaQuery } from 'react-responsive';

import TimelineSlider from '@shared/components/TimelineMap/timeline-slider/TimelineSlider';
import useTranslation from '@shared/hooks/useTranslation';
import {
  InfoIcon,
} from '@shared/icons';

import './VideoSeeker.scss';

function VideoSeeker({
  startedAt,
  endedAt,
  onSelectTimeRange,
  isFixed,
}: {
  startedAt: Date | string;
  endedAt: Date | string;
  onSelectTimeRange: (data: any) => void;
  isFixed?: boolean;
}) {
  const i18n = useTranslation('eventPage');

  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });
  // const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });

  return (
    <div>
      <TimelineSlider
        startedAt={startedAt}
        endedAt={endedAt}
        onSelectTimeRange={onSelectTimeRange}
      />

      {isSmScreen && (
        <>
          <p
            className={`alert-info d-flex align-items-center mt-3 ${isFixed ? 'mx-2' : ''}`}
          >
            <InfoIcon className="me-1" />
            <span
              className="caption1 video-seeker-time-slider-info"
            >
              {i18n.description.timeSlider}
            </span>
          </p>
          <div className={classNames('video-seek-container px-1', { sm: isSmScreen, lg: !isSmScreen, 'mx-2': isFixed })}>
            <div className="video-seeker pb-2">
              <div className="ads-container mb-3 d-flex position-relative">
                <div className="ads-content d-flex px-3 align-items-center">
                  <Marquee>
                    <div className="mx-3">
                      <div className="s2">{i18n.label.advertise}</div>
                    </div>
                    <div className="mx-3">
                      <div className="s2">{i18n.label.advertise}</div>
                    </div>
                    <div className="mx-3">
                      <div className="s2">{i18n.label.advertise}</div>
                    </div>
                  </Marquee>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!isSmScreen && (
        <p className="alert-info px-2 py-1 d-flex align-items-center mt-3">
          <InfoIcon className="me-2" /> <span className="caption1">{i18n.description.timeSlider}</span>
        </p>
      )}
    </div>
  );
}

export default VideoSeeker;
