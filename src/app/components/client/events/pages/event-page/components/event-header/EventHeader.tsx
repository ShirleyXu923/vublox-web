/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
import classNames from 'classnames';
import _ from 'lodash';
import React, {
  useEffect, useState,
} from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  Link,
  NavLink,
  useNavigate,
  // useNavigate,
  useParams,
} from 'react-router-dom';
import {
  Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown,
} from 'reactstrap';

import { useShareLinkModal } from '@app/providers/share-provider/ShareProvider';
import EndModal from '@components/client/content-manager/components/my-events/components/end-modal/EndModal';
import { StartModal } from '@components/client/content-manager/components/my-events/components/start-modal';
import appConfig from '@config/app';
import LocaleService from '@services/LocaleService';
import './EventHeader.scss';
import { Button } from '@shared/buttons/Button';
import { FollowButton } from '@shared/buttons/follow-button';
import { EventBioModal } from '@shared/components/Modal/EventBioModal';
import {
  dateToCalendar, dateToTime, getProfileLink,
  shortNumberFormat,
} from '@shared/helpers';
import {
  ArrowDownIcon,
  CalendarIcon,
  CategoryIcon,
  ChevronRightIcon,
  LocationIcon,
  VisibilityOnIcon,
} from '@shared/icons';
import Ellipse from '@shared/icons/Ellipse';
// import PlusIcon from '@shared/icons/PlusIcon';
import PrivacyPolicy from '@shared/icons/PrivacyPolicy';
import SocialShare from '@shared/icons/SocialShare';
import Avatar from '@shared/utils/Avatar/Avatar';
import { CategoryType, ImageType, LocationType } from 'types';

import BioModal from './BioModal';
import EventStatsLineupsModal from '../event-stats-lineups-modal/EventStatsLineupsModal';
import Scoreboard from '../scoreboard/Scoreboard';

interface EventType {
  type: string;
  id: string;
  name: string;
  description: string;
  ownerable_id?: string;
  tags: any[];
  coCreators?: any[];
  privacy_option: string;
  is_following: boolean;
  category: CategoryType;
  banner_url: ImageType;
  location: LocationType;
  started_at: Date;
  metadata?: any;
  owner?: any;
  homeTeam?: any;
  awayTeam?: any;
  show_statistics: boolean;
  views_count: number;
}

interface EventHeaderProps {
  event: EventType;
  gameMode: boolean;
  isOwner?: boolean;
  viewAll?: boolean;
  date?: string;
}

function EventHeader({
  event,
  gameMode,
  isOwner,
  viewAll,
  date,
}: EventHeaderProps) {
  const i18n = LocaleService.getTranslations('eventPage');
  const params = useParams();
  const [ showBio, setShowBio ] = useState(false);
  const [ showEventBioModal, setShowEventBioModal ] = useState(false);
  const [ showStatsModal, setShowStatsModal ] = useState(false);
  const { toggle: toggleShare, setLink, setShareData } = useShareLinkModal();
  const isSmScreen = useMediaQuery({ query: '(max-width: 575px)' });
  // const isMdScreen = useMediaQuery({ query: '(min-width: 576px) and (max-width: 767px)' });
  // const isLgScreen = useMediaQuery({ query: '(min-width: 768px) and (max-width: 991px)' });
  const navigate = useNavigate();
  const handleShare = () => {
    setShareData({
      data_id: event?.id,
      data_type: 'Event',
      receiver_id: event?.ownerable_id,
    });
    setLink(`${appConfig.baseUrl}/events/${event?.id}`);
    toggleShare(true);
  };

  // Change to collapsible component when mobile to utilize scss
  const [ isExpanded, setIsExpanded ] = useState(true);
  const [ scrollPosition, setScrollPosition ] = useState(0);
  // const [ isUserToggled, setIsUserToggled ] = useState(false); // Tracks manual toggle

  const handleToggle = () => {
    setIsExpanded(prev => !prev); // Toggle the expanded state
  };

  const [ endModal, setEndModal ] = useState(false);
  const [ startModal, setStartModal ] = useState(false);
  const [ isEndNow, setIsEndNow ] = useState(false);

  const toggleStartModal = () => setStartModal(!startModal);
  const toggleEndModal = () => setEndModal(!endModal);

  const handleEndModal = (endNow = false) => {
    setIsEndNow(endNow);
    setEndModal(true);
  };
  const SCROLL_THRESHOLD = 200;
  const throttledHandleScroll = _.throttle((scrollTop, prevPosition) => {
    const isScrollUp = scrollTop > prevPosition;
    if (isExpanded && isScrollUp && scrollTop < SCROLL_THRESHOLD) {
      setIsExpanded(false);
    }
    setScrollPosition(scrollTop);
  }, 100);

  useEffect(() => {
    const handleScroll = () => {
      throttledHandleScroll(window.scrollY, scrollPosition);
    };

    const handleModalScroll = (e: any) => {
      throttledHandleScroll(e.target.scrollTop, scrollPosition);
    };

    const modals = document.querySelectorAll('.event-page.modal-body');
    modals.forEach(modal => modal.addEventListener('scroll', handleModalScroll));
    window.addEventListener('scroll', handleScroll);
    return () => {
      throttledHandleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
      modals.forEach(modal => modal.removeEventListener('scroll', handleModalScroll));
    };
  }, [ isExpanded, scrollPosition, throttledHandleScroll ]);

  return (
    <>
      {/* Separated scoreboard from other components and make it sticky */}
      {(event.metadata) && (
        <div
          className={`game-timeline-header-mobile ${isExpanded ? 'scoreboard-header-mobile-expanded' : ''}`}
        >
          <Scoreboard event={event} toggle={handleToggle} isExpanded={isExpanded} />
        </div>
      )}
      <Row className={classNames('justify-content-center event-header', { 'mt-3': !isSmScreen })}>
        {/* Title Section */}
        <Col
          md={gameMode && event.banner_url ? 8 : 12}
          className={
            (!event.banner_url || !event.location) && !gameMode && isSmScreen
              ? 'mt-0'
              : (!event.metadata && gameMode ? '' : '')
          }
        >
          <div
            className={classNames('title', 'mb-0', {
              'mt-0': gameMode && !isSmScreen && event.metadata,
            })}
          >
            <div className="informative">
              <h2 className="mb-0">
                {(event?.homeTeam && event?.awayTeam) ? (
                  <>
                    <Link to={`/organizations/${event?.homeTeam?.id}`} target="_blank" className="team-link">
                      {event?.homeTeam?.name}
                    </Link>
                    {' '}
                    vs
                    {' '}
                    <Link to={`/organizations/${event?.awayTeam?.id}`} target="_blank" className="team-link">
                      {event?.awayTeam?.name}
                    </Link>
                  </>
                ) : event?.name}
              </h2>
              <div className="bio-container">
                <p className="b3 text-truncate mt-1 mb-2">{event?.description}</p>
                {(gameMode || (!gameMode && !isSmScreen)) && (
                  <UncontrolledDropdown toggle={() => setShowBio(!showBio)} isOpen={showBio} direction="start">
                    <DropdownToggle>
                      <div className="icon-btn" onClick={() => setShowBio(true)}>
                        <ChevronRightIcon />
                      </div>
                    </DropdownToggle>
                    <DropdownMenu>
                      <BioModal
                        onClose={() => setShowBio(false)}
                        description={event?.description}
                        tags={event?.tags}
                        coCreators={event?.coCreators}
                      />
                    </DropdownMenu>
                  </UncontrolledDropdown>
                )}
              </div>
              {isSmScreen ? (
                <>
                  <div className="info">
                    {/* Category */}
                    <div className="item">
                      <span className="caption1">{event?.category?.name}</span>
                    </div>
                    <Ellipse />
                    {/* Privacy */}
                    <div className="item">
                      <span className="caption1 text-capitalize">{event?.privacy_option}</span>
                    </div>
                    <Ellipse />

                    {/* Date and Time */}
                    <div className="item">
                      <span className="caption1 text-capitalize">
                        {date || `${dateToCalendar(event?.started_at)}, ${dateToTime(event?.started_at)}`}
                      </span>
                    </div>

                    {event?.location && (
                      <React.Fragment>
                        <Ellipse />
                        {/* Location */}
                        <div className="item">
                          <NavLink to={`/locations/${event.location.slug}`} className="link">
                            <span className="caption1">{event?.location?.name}</span>
                          </NavLink>
                        </div>
                      </React.Fragment>
                    )}

                    <Ellipse />
                    <div className="item">
                      <span className="caption1">
                        {`${shortNumberFormat(event?.views_count)} `}{LocaleService.getPluralizedTranslation(i18n.label.views, event?.views_count, false)}
                      </span>
                    </div>

                    {!gameMode && (
                      <>
                        <Ellipse />
                        <div className="item">
                          <span className="caption1 view-more-mobile" onClick={() => setShowEventBioModal(true)}>{i18n.label.viewMore}</span>
                          <ChevronRightIcon />
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="info">
                    {/* Category */}
                    <div className="item">
                      <CategoryIcon />
                      <span className="caption1">{event?.category?.name}</span>
                    </div>
                    <Ellipse />
                    {/* Privacy */}
                    <div className="item">
                      <PrivacyPolicy />
                      <span className="caption1 text-capitalize">{event?.privacy_option}</span>
                    </div>
                    <Ellipse />
                    <div className="item">
                      <CalendarIcon />
                      <span className="caption1 text-capitalize">
                        {date || `${dateToCalendar(event?.started_at)}, ${dateToTime(event?.started_at)}`}
                      </span>
                    </div>
                    {event?.location && (
                      <React.Fragment>
                        <Ellipse />
                        {/* Location */}
                        <div className="item">
                          <LocationIcon />
                          <NavLink to={`/locations/${event.location.slug}`} className="link">
                            <span className="caption1">{event?.location?.name}</span>
                          </NavLink>
                        </div>
                      </React.Fragment>
                    )}

                    <Ellipse />
                    <div className="item">
                      <VisibilityOnIcon />
                      <span className="caption1">
                        {`${shortNumberFormat(event?.views_count)} `}{LocaleService.getPluralizedTranslation(i18n.label.views, event?.views_count, false)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Col>
        <Col md={12}>
          <div className="d-flex mb-2 mt-3 align-items-center">
            <NavLink to={getProfileLink(event?.owner)}>
              <Avatar
                user={event?.owner || {}}
                size="sm"
              />
            </NavLink>
            <div className="flex-fill ms-2">
              <NavLink to={getProfileLink(event?.owner)} className="profile-link b5">
                {event?.owner?.name || event?.owner?.display_name}
              </NavLink>
            </div>
          </div>
        </Col>

        <Col md={12} className={classNames({ 'd-none': viewAll })}>
          <div className="links mt-3">
            <div className="row g-2 d-flex flex-fill">
              {isOwner && (
                <>
                  {(event?.type === 'indefinite' || event?.type === 'live') && event.started_at && (
                    <Col xs={6} md={3} className="d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                      <UncontrolledDropdown style={{ width: '100%' }}>
                        <DropdownToggle
                          style={{ width: '100%' }}
                          color="primary"
                          className="end-now-button-dropdown-toggle d-flex align-items-center justify-content-center"
                        >
                          {i18n.label.endNow}
                          <div className="arrow ms-2">
                            <ArrowDownIcon />
                          </div>
                        </DropdownToggle>
                        <DropdownMenu className="end-date-dropdown-menu">
                          <DropdownItem onClick={() => handleEndModal()}>
                            {i18n.label.addEndDate}
                          </DropdownItem>
                          <DropdownItem onClick={() => handleEndModal(true)}>
                            {i18n.label.endNow}
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  )}
                </>
              )}

              {/* Follow/Unfollow Button - only shows if not owner */}
              {!isOwner && (
                <Col xs={6} md={3} className="d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                  <FollowButton
                    followId={params.id || ''}
                    followType="Event"
                    isFollowing={event?.is_following}
                  />
                </Col>
              )}

              {event.show_statistics && (
                <Col xs={6} md={3} className="d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                  <Button
                    color="primary"
                    label={i18n.label.statsLineups}
                    onClick={() => setShowStatsModal(true)}
                  />
                </Col>
              )}

              {/* Share Button */}
              {isOwner && (event?.type === 'upcoming' || event?.type === 'indefinite') && (
                <Col xs={6} md={3} className="d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                  <Button
                    color="primary"
                    label="Edit Event"
                    onClick={() => navigate(`/events/${event?.id}/edit#step-1`)}
                  />
                </Col>
              )}
              <Col
                xs={6}
                md={!isOwner || event?.type === 'upcoming' || (event?.type === 'indefinite' && event.started_at) || (event?.type === 'indefinite' || event?.type === 'live') ? 3 : 6}
                className="d-flex justify-content-center align-items-center p home-page-create-button-mobile"
              >
                <Button
                  color="primary"
                  outline
                  label={i18n.label.share}
                  icon={<SocialShare fill="var(--bs-primary)" />}
                  onClick={handleShare}
                />
              </Col>

            </div>
          </div>
        </Col>
      </Row>

      <StartModal modal={startModal} toggle={toggleStartModal} data={event} />
      <EndModal modal={endModal} toggle={toggleEndModal} data={event} isEndNow={isEndNow} />
      <EventBioModal
        title={i18n.label.info}
        event={event}
        isOpen={showEventBioModal}
        toggle={() => setShowEventBioModal(!showEventBioModal)}
      />

      {event.show_statistics && (
        <EventStatsLineupsModal
          event={event}
          show={showStatsModal}
          toggle={() => setShowStatsModal(s => !s)}
        />
      )}
    </>
  );
}

export default EventHeader;
