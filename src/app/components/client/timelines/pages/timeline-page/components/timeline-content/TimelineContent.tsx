/* eslint-disable max-len */
import classNames from 'classnames';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  Col, Container, Nav, NavItem, Row, NavLink,
} from 'reactstrap';

import { useShareLinkModal } from '@app/providers/share-provider/ShareProvider';
import { IRootState } from '@app/store';
import appConfig from '@config/app';
import {
  getTimelineRequest,
  getTimelineTimelineRequest,
} from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { Button } from '@shared/buttons/Button';
import { FollowButton } from '@shared/buttons/follow-button';
import { AccordionTimeline } from '@shared/components/AccordionTimeline';
import ResizableTimeline from '@shared/components/ResizableTimeline/ResizableTimeline';
import { shortNumberFormat } from '@shared/helpers';
import useGeoCoding from '@shared/hooks/useGeoCoding';
import useTimelineMap from '@shared/hooks/useTimelineMap';
import { ChevronRightIcon, LocationIcon, VisibilityOnIcon } from '@shared/icons';
import Ellipse from '@shared/icons/Ellipse';
import Note from '@shared/icons/Note';
import PrivacyPolicy from '@shared/icons/PrivacyPolicy';
import SocialShare from '@shared/icons/SocialShare';

import TimelinePagePlaceholder from '../../TimelinePagePlaceholder';
import BioModal from '../BioModal';
import PrivateTimeline from '../PrivateTimeline';

import '../../TimelinePage.scss';

function TimelineContent({
  id, preview, defaultItem, TimelineMapComponent, TimelineComponent,
}:
{ id?: string; preview?: boolean; defaultItem?: any; TimelineMapComponent: FC<any>, TimelineComponent: FC<any> }) {
  const i18n = LocaleService.getTranslations('timelinePage');
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const params = useParams();
  const [ showBio, setShowBio ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ query, setQuery ] = useState<any>({});
  const t = useSelector((state: IRootState) => state.Timeline.timeline as any);
  const [ timeline, setTimeline ] = useState(defaultItem || t);
  const { toggle: toggleShare, setLink, setShareData } = useShareLinkModal();
  const account = useSelector((state: IRootState) => state.Auth.account);
  const isOwner = useMemo(() => Boolean(timeline?.timeline?.ownerable_id && account?.id && timeline?.timeline?.ownerable_id === account?.id),
    [ timeline?.timeline?.ownerable_id, account?.id ]);
  const canViewTimeline = useMemo(() => {
    const timelineData = timeline?.timeline;

    return timelineData?.privacy_option === 'public' || isOwner;
  }, [ timeline?.timeline, isOwner ]);
  const { getCountryFromCoordinate } = useGeoCoding();
  const location = useLocation();
  const {
    markers, startDate, endDate, setDates, setTimelineMarkers, setVisibleTimelineMarkers,
  } = useTimelineMap();

  const loadData = async () => {
    setLoading(true);
    try {
      await dispatch(getTimelineRequest(id || '')).$promise;
    } catch (err) {
      handleError(err, navigate);
    } finally {
      setLoading(false);
    }
  };

  const reloadTimeline = async () => {
    setLoading(true);
    await loadData();
    setLoading(false);
  };

  const isMobileScreen = useMediaQuery({ query: '(max-width: 576px)' });
  const TabIds = {
    TIMELINE: i18n.label.timeline,
    REWARDS_CENTER: i18n.label.myRewards,
  } as const;

  const tabs = [
    { id: TabIds.TIMELINE, label: i18n.label.timeline },
    { id: TabIds.REWARDS_CENTER, label: i18n.label.myRewards },

  ];
  const [ activeTab, setActiveTab ] = useState<typeof TabIds[keyof typeof TabIds]>(TabIds.TIMELINE);

  const handleShare = () => {
    setShareData({
      data_id: timeline?.timeline?.id,
      data_type: 'Timeline',
      receiver_id: timeline?.timeline?.ownerable_id,
    });

    setLink(`${appConfig.baseUrl}/timelines/${id}`);
    toggleShare(true);
  };

  const handleEditClick = useCallback(() => {
    const timelineId = timeline?.timeline?.id;

    if (!timelineId) {
      navigate('/errors/404');
      return;
    }

    navigate(`/timelines/${timelineId}/edit`);
  }, [ timeline?.timeline?.id, navigate ]);

  useEffect(() => {
    if (!timeline || !timeline?.timeline?.location) {
      return;
    }

    const { latitude, longitude } = timeline.timeline.location;
    getCountryFromCoordinate({
      latitude: +latitude,
      longitude: +longitude,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ timeline ]);

  useEffect(() => {
    reloadTimeline();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ location ]);

  useEffect(() => {
    setTimeline(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ t ]);

  return (
    <div className="timeline-page full-container">
      <Container className="timeline-page-container pt-5">
        {loading && (
          <Row className="justify-content-center">
            <TimelinePagePlaceholder />
          </Row>
        )}
        {!loading && (
          <Row className="justify-content-center">
            {params?.parentId && (
              <Col>
                <div className="breadcrumbs">
                  <Link
                    to={`/timelines/${params?.parentId}`}
                    onClick={reloadTimeline}
                    className="b5"
                  >
                    <span>{timeline?.parent?.name}</span>
                  </Link>
                  <ChevronRightIcon />
                  <span className="b6">{timeline?.timeline?.name}</span>
                </div>
              </Col>
            )}
            <Col className={timeline?.timeline?.location ? '' : 'no-location-wrapper'}>
              <div className="title-section">
                <h2 className={classNames({ s3: isMobileScreen })}>
                  {timeline?.timeline?.name}
                </h2>
                <div className="bio-container">
                  <p className={`bio text-truncate ${isMobileScreen ? '' : 'mb-0'}`}>{timeline?.timeline?.description}</p>
                  {!isMobileScreen && (
                    <div className="icon-btn" onClick={() => setShowBio(true)}>
                      <ChevronRightIcon />
                    </div>
                  )}
                  {showBio && (
                    <BioModal
                      onClose={() => setShowBio(false)}
                      description={timeline?.timeline?.description}
                      tags={timeline?.timeline?.tags}
                    />
                  )}
                </div>
                {isMobileScreen
                  ? (
                    <div className="info">
                      <div className="link">
                        <Note />
                        <span>{timeline?.timeline?.category?.name}</span>
                      </div>
                      <Ellipse />
                      <div className="link">
                        <PrivacyPolicy />
                        <span className="text-capitalize">{timeline?.timeline?.privacy_option}</span>
                      </div>
                      {timeline?.timeline?.location && (
                        <>
                          <Ellipse />
                          <div className="link">
                            <LocationIcon width={16} height={16} />
                            <NavLink to={`/locations/${timeline?.timeline?.location?.slug}`}>
                              <span>{timeline?.timeline?.location?.name}</span>
                            </NavLink>
                          </div>
                        </>
                      )}

                      <Ellipse />
                      <div className="link">
                        <VisibilityOnIcon width={16} height={16} />
                        <span>
                          {`${shortNumberFormat(timeline?.timeline?.views_count)} `}{LocaleService.getPluralizedTranslation(i18n.label.views, timeline?.timeline?.views_count, false)}
                        </span>
                      </div>

                      <Ellipse />
                      <div className="bio-wrapper px-0 mx-0 ">
                        <div className="icon-btn" onClick={() => setShowBio(true)}>
                          <span style={{ fontSize: '10px', color: 'var(--bs-primary)' }}>{i18n.button.viewMoreInfo}</span>
                          <ChevronRightIcon className="chevron-icon" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="icons">
                      <div className="link">
                        <Note />
                        <span>{timeline?.timeline?.category?.name}</span>
                      </div>
                      <Ellipse />
                      <div className="link">
                        <PrivacyPolicy />
                        <span className="text-capitalize">{timeline?.timeline?.privacy_option}</span>
                      </div>
                      <Ellipse />
                      {timeline?.timeline?.location && (
                        <div className="link">
                          <LocationIcon width={16} height={16} />
                          <Link to={`/locations/${timeline?.timeline?.location?.slug}`}>
                            <span>{timeline?.timeline?.location?.name}</span>
                          </Link>
                        </div>
                      )}

                      <Ellipse />
                      <div className="link">
                        <VisibilityOnIcon />
                        <span className="caption1">
                          {`${shortNumberFormat(timeline?.timeline?.views_count)} `}{LocaleService.getPluralizedTranslation(i18n.label.views, timeline?.timeline?.views_count, false)}
                        </span>
                      </div>

                    </div>
                  )}
                <div className={`container mx-0 small-col-profile ${isMobileScreen ? 'mt-3' : 'mt-2'}`}>
                  <div className="row d-flex justify-content-start">
                    {/* Edit Button for Owner */}
                    {isOwner && (
                      <div
                        className="col-3 d-flex justify-content-center align-items-center p home-page-create-button-mobile"
                        style={{ paddingLeft: !isMobileScreen ? 0 : '' }}
                      >
                        <Button
                          onClick={handleEditClick}
                          color="primary"
                          label={i18n.label.editTimeline}
                        />
                      </div>
                    )}

                    {/* Follow/Unfollow Button */}
                    {!isOwner && (
                      <div
                        className="col-3 d-flex justify-content-center align-items-center p home-page-create-button-mobile"
                        style={{ paddingLeft: !isMobileScreen ? 0 : '' }}
                      >
                        <FollowButton
                          followId={id || ''}
                          followType="Timeline"
                          isFollowing={timeline?.timeline?.is_following}
                        />
                      </div>

                    )}

                    {/* Share Button */}
                    <div
                      className="col-3 d-flex justify-content-center align-items-center p ps-0 home-page-create-button-mobile"
                      style={{ paddingRight: !isMobileScreen ? 0 : '' }}
                    >
                      <Button
                        color="primary"
                        outline
                        label={i18n.label.share}
                        icon={<SocialShare fill="var(--bs-primary)" />}
                        onClick={handleShare}
                      />
                    </div>
                  </div>
                </div>

              </div>
              <div className="scrolling-pills-timeline d-flex overflow-auto gap-2 mt-4 mb-4">
                <Nav pills className="flex-nowrap gap-2">
                  {tabs.map(tab => (
                    <NavItem key={tab.id}>
                      <NavLink
                        active={activeTab === tab.id}
                        className="tab-link text-nowrap d-flex justify-content-center align-items-center"
                        onClick={() => setActiveTab(tab.id)}
                        aria-label={`${tab.label} tab`}
                        style={{ cursor: 'pointer' }}
                      >
                        {tab.label}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </div>
            </Col>

            {activeTab !== TabIds.TIMELINE && (
              <h3 className="d-flex justify-content-center align-items-center mt-5">{i18n.label.upcoming}</h3>
            )}
          </Row>
        )}
      </Container>

      {activeTab === TabIds.TIMELINE && (
        <ResizableTimeline
          mapComponent={(
            <TimelineMapComponent
              markers={markers}
              startDate={startDate}
              endDate={endDate}
              location={timeline?.timeline?.location}
              loading={loading}
              onSelectTimeRange={(data: any) => setQuery((s: any) => ({ ...s, ...data }))}
            />
          )}
          timeline={canViewTimeline ? (
            <AccordionTimeline
              request={getTimelineTimelineRequest}
              createPostLink={timeline?.timeline?.id
                ? `/posts/create?postable_id=${timeline?.timeline?.id}&postable_type=Timeline#step-1`
                : '#'}
              createEventLink={timeline?.timeline?.id
                ? `/events/create?eventable_id=${timeline?.timeline?.id}&eventable_type=Timeline#step-1`
                : '#'}
              createTimelineLink={timeline?.timeline?.id
                ? `/timelines/create?timelineable_id=${timeline?.timeline?.id}&timelineable_type=Timeline`
                : '/timelines/create'}
              query={{
                ...query,
                id,
              }}
              defaultTimescale="1-h"
              onChangeTimeline={setTimelineMarkers}
              onChangeVisibleItems={setVisibleTimelineMarkers}
              onChangeDates={setDates}
              preview={preview}
              link={`/timelines/${id}`}
              TimelineComponent={TimelineComponent}
            />
          ) : (
            <PrivateTimeline />
          )}
        />
      )}
    </div>
  );
}

export default TimelineContent;
