import classNames from 'classnames';
import { debounce } from 'lodash';
import moment from 'moment';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import Marquee from 'react-fast-marquee';
import { useMediaQuery } from 'react-responsive';
import { Button, Collapse } from 'reactstrap';

import PostModal from '@shared/components/PreviewModal/PostModal/PostModal';
import useTranslation from '@shared/hooks/useTranslation';
import { ArrowDownIcon, ArrowUpIcon } from '@shared/icons';

import { EventMap } from '../event-map';
import VideoSeeker from '../video-seeker/VideoSeeker';

export interface EventMapProps {
  event: any;
  items: any;
  showPost: (id: string) => void
}

function EventStadium({
  event, locations, reload, endDate, preview,
}:
{
  event: any;
  locations: any[];
  reload: (params: any) => void
  endDate: Date | string;
  preview?: boolean;
}) {
  const i18n = useTranslation('eventPage');
  // const navigate = useNavigate();
  const [ showStadium, setShowStadium ] = useState(true);
  // const [ stadiumWidth, setStadiumWidth ] = useState(0);
  const [ isFixed, setIsFixed ] = useState(false);
  const [ scrollPosition, setScrollPosition ] = useState(0);

  const [ showPost, setShowPost ] = useState(false);
  const [ selectedPost, setSelectedPost ] = useState<string | undefined>(undefined);

  const stadiumViewRef = useRef<HTMLDivElement>(null);
  const stadiumRef = useRef<HTMLDivElement>(null);

  const isMdScreen = useMediaQuery({ query: '(max-width: 991px)' });
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });

  // const initialize = () => {
  //   setStadiumWidth(stadiumViewRef.current?.getBoundingClientRect().width || 0);
  // };

  const toggleStadium = () => {
    setShowStadium(!showStadium);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleApplyTimeRange = useCallback(debounce(({
    from_minutes: fromMinutes,
    to_minutes: toMinutes,
  }: { from_minutes: string, to_minutes: string }, e: any) => {
    const startedAt = new Date(e.started_at);
    reload({
      start_date: moment(startedAt).add(+fromMinutes, 'minutes').toISOString(),
      end_date: moment(startedAt).add(+toMinutes, 'minutes').toISOString(),
    });
  }, 500), []);

  const handleElementScroll = (scrollTop: any, scrollHeight: any, documentScrollHeight = 0) => {
    const offsetTop = stadiumViewRef.current?.offsetTop || 0;
    const position = offsetTop;

    // Ignore scroll position jump due to height change or if no more space to scroll
    const isAtBottom = Math.ceil(scrollHeight)
        >= (documentScrollHeight || document.documentElement.scrollHeight);
    const isScrollUp = scrollTop < scrollPosition;
    let offset = isMdScreen ? 75 : 100;
    offset = isSmScreen ? 50 : offset;

    if ((Math.abs(scrollTop - scrollPosition) > offset && isScrollUp) || isAtBottom) {
      setScrollPosition(scrollTop);
      return;
    }

    // Change the threshold as needed
    if (scrollTop > position && !isFixed && !isScrollUp) {
      setIsFixed(true);
      // document.getElementById('scoreboard')?.classList.remove('show');
    } else if (scrollTop <= position && isFixed && isScrollUp) {
      setIsFixed(false);
    }
    setScrollPosition(scrollTop);
  };

  // useEffect(() => {
  //   initialize();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [ stadiumViewRef.current ]);

  useEffect(() => {
    const handleScroll = () => {
      handleElementScroll(window.scrollY, window.innerHeight + window.scrollY);
    };

    const handleModalScroll = (e: any) => {
      const computed = getComputedStyle(e.target);
      const padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);

      const innerHeight = e.target.clientHeight - padding;
      handleElementScroll(e.target.scrollTop, innerHeight + e.target.scrollTop,
        e.target.scrollHeight);
    };

    const modals = document.querySelectorAll('.event-page.modal-body');
    modals.forEach(modal => modal.addEventListener('scroll', handleModalScroll));
    window.addEventListener('scroll', handleScroll);

    return () => {
      modals.forEach(modal => modal.removeEventListener('scroll', handleModalScroll));
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ stadiumViewRef.current, scrollPosition, isFixed ]);

  // useDeepEffect(() => {
  //   setLocations(Object.keys(event.timeblockables).reduce((a: any, b: any) => {
  //     const data: any = event.timeblockables[b];
  //     const posts = data.reduce((c: any, d: any) => {
  //       if (d.type === 'Group') {
  //         return [
  //           ...c,
  //           ...d.items.filter((p: any) => !!p.data?.location)
  //             .map((p: any) => p.data),
  //         ];
  //       }
  //       return c;
  //     }, []);
  //     return [
  //       ...a,
  //       ...posts,
  //     ];
  //   }, []) as any);
  // }, [ event.timeblockables ]);

  return (
    <>
      <div ref={stadiumViewRef} />
      <div
        ref={stadiumRef}
        className={classNames({
          'fixed-stadium  mx-auto': isFixed,
          xs: isXsScreen,
        })}
        // style={{
        //   maxWidth: isFixed ? `${stadiumWidth}px` : '100%',
        // }}
      >

        <Button
          color="link"
          size="sm"
          onClick={toggleStadium}
          className={`px-0 hide-and-show-label-color mb-1 hide-and-show-button-stadium
          ${showStadium ? 'absolute' : ''}
          ${isFixed && !showStadium ? 'fixed' : ''}
          ${isFixed && showStadium ? 'd-none' : ''}
          `}
        >
          {showStadium ? (
            <>
              {i18n.label.hideMap}
              <ArrowUpIcon className="ms-1" stroke="var(--bs-white)" />
            </>
          ) : (
            <>
              {i18n.label.showMap}
              <ArrowDownIcon width={15} stroke="var(--bs-white)" />
            </>
          )}
        </Button>

        <Collapse isOpen={showStadium} className="stadium">
          <div className="location-container">
            {event && (
              <EventMap
                countryCode={event.location?.country_code}
                items={locations}
                event={event}
                showPost={(item: any) => {
                  if (preview) {
                    window.open(`/posts/${item.id}`, '_blank');
                    return;
                  }
                  setSelectedPost(item);
                  setShowPost(true);
                }}
                refreshMap={reload}
                showHideAndShowButton={isFixed && showStadium}
                toggleStadium={toggleStadium}
              />
            )}
            {!isSmScreen && (
              <div className="ads-wrapper-mobile py-3">
                <div className="ads-container-mobile d-flex position-relative">
                  <div className="ads-content-mobile d-flex px-3 align-items-center">
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
            )}
            <div className="video__seeker px-2">
              {!isSmScreen && (
                <VideoSeeker
                  startedAt={event?.started_at}
                  endedAt={endDate}
                  onSelectTimeRange={(p) => handleApplyTimeRange(p, event)}
                />
              )}
            </div>
          </div>
          {(isSmScreen) && (
            <VideoSeeker
              startedAt={event?.started_at}
              endedAt={endDate}
              onSelectTimeRange={(p) => handleApplyTimeRange(p, event)}
              isFixed={isFixed}
            />
          )}
        </Collapse>
        <div className={`ads-wrapper-mobile py-2 ${showStadium ? 'd-none' : ''} ${isFixed && isSmScreen ? 'mx-3 ads-wrapper-custom-width' : ''}`}>
          <div className="ads-container-mobile mb-3 d-flex position-relative">
            <div className="ads-content-mobile d-flex px-3 align-items-center">
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

      <PostModal
        item={selectedPost}
        show={showPost}
        toggle={() => setShowPost(false)}
      />
    </>
  );
}

export default EventStadium;
