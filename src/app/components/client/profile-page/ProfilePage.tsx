/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive'; // Added Existing for media query
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Spinner,
  Nav, NavItem, NavLink,
} from 'reactstrap';

import './ProfilePage.scss';

import { useShareLinkModal } from '@app/providers/share-provider/ShareProvider';
import { IRootState } from '@app/store';
import appConfig from '@config/app';
import {
  changeAccountRequest, getProfileTimelineRequest, getUserDetailsRequest, updateImageRequest,
} from '@reducers/auth/AuthAction';
import { getProfileRequest } from '@reducers/user-profile/UserProfileAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { Button } from '@shared/buttons/Button';
import { FollowButton } from '@shared/buttons/follow-button';
import { AccordionTimeline } from '@shared/components/AccordionTimeline';
import { Timeline } from '@shared/components/AccordionTimeline/components/timeline';
import ClaimModal from '@shared/components/Modal/ClaimModal/ClaimModal';
import FollowersModal from '@shared/components/Modal/FollowersModal/FollowersModal';
import FollowingModal from '@shared/components/Modal/FollowingModal/FollowingModal';
import { ProfileLogoComponent } from '@shared/components/ProfileLogoComponent';
import ResizableTimeline from '@shared/components/ResizableTimeline/ResizableTimeline';
import TimelineMap from '@shared/components/TimelineMap/TimelineMap';
import { getFormData, shortNumberFormat } from '@shared/helpers';
import useTimelineMap from '@shared/hooks/useTimelineMap';
import { ChevronRightIcon, StarIcon } from '@shared/icons';
import Ellipse from '@shared/icons/Ellipse';
import SocialShare from '@shared/icons/SocialShare';
import Verified from '@shared/icons/Verified';

import ProfilePagePlaceholder from './ProfilePagePlaceholder';
import BioModal from './components/BioModal';
import PrivateTimeline from '../timelines/pages/timeline-page/components/PrivateTimeline';

function ProfilePage() {
  const i18n = LocaleService.getTranslations('profilePage');
  const dispatch = useDispatch<any>();
  const params = useParams();
  const navigate = useNavigate();
  const profileRef = useRef<any>(null);
  const user = useSelector((state: IRootState) => state.Auth.user);
  const profile = useSelector((state: IRootState) => state.Profile?.profile);
  const [ showProfileOptions, setShowProfileOptions ] = useState(false);
  const [ form, setForm ] = useState({
    image: null,
    cover_image: null,
  });
  const [ query, setQuery ] = useState<any>({});
  const [ showBioModal, setShowBioModal ] = useState(false);
  const [ isProfileLoading, setIsProfileLoading ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ showClaimModal, setShowClaimModal ] = useState(false);
  const [ showFollowersModal, setShowFollowersModal ] = useState(false);
  const [ showFollowingModal, setShowFollowingModal ] = useState(false);
  const { toggle: toggleShare, setLink, setShareData } = useShareLinkModal();
  const location = useLocation();
  const {
    markers, startDate, endDate, setDates, setTimelineMarkers, setVisibleTimelineMarkers,
  } = useTimelineMap();

  // Case for is small screen from the useMediaQuery
  const isSmScreen = useMediaQuery({ query: '(max-width: 576px)' });
  // State for the drop down

  //
  const [ activeTab, setActiveTab ] = useState('timeline');
  const tabs = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'myRewards', label: 'My Rewards' },
    // The next tabs following are just sample to demonstrate the scrollable pills
  ];
  const handleShare = () => {
    setShareData({
      data_id: profile?.id,
      data_type: 'Client',
      receiver_id: profile?.id,
    });
    setLink(`${appConfig.baseUrl}/profile/${profile?.id}`);
    toggleShare(true);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      await dispatch(getProfileRequest({
        user_id: params?.id || user.id,
      })).$promise;
    } catch (err) {
      handleError(err, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  const submitChanges = async (fd: any) => {
    try {
      const formData = getFormData(fd);
      await dispatch(updateImageRequest(formData)).$promise;
      loadData();
      await dispatch(getUserDetailsRequest());
      setShowProfileOptions(false);
    } catch (error: any) {
      handleError(error);
      setShowProfileOptions(false);
    }
  };

  const handleProfileChange = async (e: any) => {
    setForm({
      ...form,
      image: e.target.files[0],
    });

    setIsProfileLoading(true);
    await submitChanges({
      image: e.target.files[0],
    });
    setIsProfileLoading(false);
  };

  const initialLoad = async () => {
    setIsLoading(true);
    await loadData();
    setIsLoading(false);
  };

  const updateLogo = async () => {
    await dispatch(changeAccountRequest({
      ...profile,
      type: 'user',
    }));
  };

  useEffect(() => {
    const url = window.location.href;

    if (url.includes('/profile') && !url.includes('/profile/')) {
      updateLogo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ profile ]);

  useEffect(() => {
    initialLoad();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ location ]);

  return (
    <div className="profile-page full-container">

      <Container className="profile-page-wrapper mt-3 mt-md-5">
        {isLoading
          ? (
            <Row className="profile-section mx-0 px-0">
              <ProfilePagePlaceholder />
            </Row>
          )
          : (
            <>
              {/* Cover Photo Section */}
              {/* Profile Section */}
              { /* If small screen is true then show another format */}
              <Row className="profile-page-wrapper profile-section mx-0 px-0 pt-4 pt-md-0">
                {isSmScreen ? (
                  <>
                    <Row className="align-items-center no-gutters d-flex pe-1 ms-1 mb-3 mx-0 profile-row">
                      {/* Profile picture on the left */}
                      <Col xs={2} className="d-flex justify-content-center">
                        <div className="profile-wrapper"> {/* Ensure relative positioning */}
                          <input
                            onChange={handleProfileChange}
                            type="file"
                            style={{ display: 'none' }}
                            ref={profileRef}
                          />
                          <Dropdown
                            isOpen={showProfileOptions}
                            toggle={() => setShowProfileOptions(!showProfileOptions)}
                          >
                            <DropdownToggle>
                              <div className="profile-photo">
                                {isProfileLoading ? (
                                  <Spinner size="md" />
                                ) : (
                                  <ProfileLogoComponent name={profile?.display_name} image={profile?.image?.md} />
                                )}
                              </div>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={() => toast.info(i18n.label.upcoming)}>
                                <div className="b5 text-body">{i18n.label.viewPhoto}</div>
                              </DropdownItem>
                              {user?.id === profile?.id && (
                                <DropdownItem onClick={() => { profileRef?.current?.click(); }}>
                                  <div className="b5 text-body">{i18n.label.changePhoto}</div>
                                </DropdownItem>
                              )}
                            </DropdownMenu>
                          </Dropdown>

                          {/* Badge SVG */}
                          {/* <div className="badge-svg">
                            <Badge />
                          </div> */}
                        </div>
                      </Col>

                      {/* Display name and bio on the right */}
                      <Col xs={10} className="d-flex justify-content-start align-items-center mt-2">
                        <div className="d-flex flex-column">
                          <div
                            className="mb-0 ps-2 s3 d-flex align-items-center"
                            style={{
                              textOverflow: 'ellipsis', // Truncates the text with an ellipsis if it doesn't fit
                              overflow: 'hidden', // Hides the overflow content
                              whiteSpace: 'normal', // Ensures the text stays on one line
                              fontWeight: 'bold',
                            }}
                          >
                            {profile?.display_name}
                            {profile.claimed && (
                              <Verified width={20} height={20} className="ms-1" />
                            )}
                          </div>
                          <div className="bio">

                            {profile?.bio && (
                              <div style={{ color: 'var(--bs-secondary-text)' }} className=" caption1 ps-2 bio-mobile-screen b5">{profile?.bio}</div>
                            )}

                          </div>
                        </div>
                      </Col>
                    </Row>

                  </>
                ) : (
                  <>
                    <Col lg={2}>
                      <div className="profile-wrapper">
                        <input onChange={handleProfileChange} type="file" style={{ display: 'none' }} name="" ref={profileRef} />
                        <Dropdown
                          isOpen={showProfileOptions}
                          toggle={() => setShowProfileOptions(!showProfileOptions)}
                        >
                          <DropdownToggle>
                            <div className="profile-photo">
                              {isProfileLoading ? (
                                <Spinner size="md" />
                              ) : (
                                <ProfileLogoComponent name={profile?.display_name} image={profile?.image?.md} />
                              )}
                            </div>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem onClick={() => toast.info(i18n.label.upcoming)}>
                              <div className="b5 text-body">{i18n.label.viewPhoto}</div>
                            </DropdownItem>
                            {user?.id === profile?.id && (
                              <DropdownItem onClick={() => { profileRef?.current?.click(); }}>
                                <div className="b5 text-body">
                                  {i18n.label.changePhoto}
                                </div>
                              </DropdownItem>
                            )}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </Col>
                  </>
                )}
                <Col lg={10} className="small-col-profile">
                  {!isSmScreen && (
                    <>
                      <h2 className="display-name mt-2 profile-page-spacing d-flex align-items-center">
                        {profile?.display_name}
                        {profile.claimed && (
                          <Verified width="24" height="24" className="ms-1" />
                        )}
                      </h2>
                      <div className={`bio-wrapper profile-page-spacing ${!profile?.bio ? 'mb-4' : ''}`}>
                        {profile?.bio && (
                          <div className="expand mb-3" onClick={() => setShowBioModal(!showBioModal)}>
                            <span className="text-truncate">{profile?.bio}</span>
                          </div>
                        )}
                        {!isSmScreen && showBioModal && (
                          <BioModal
                            onClose={() => setShowBioModal(!showBioModal)}
                            description={profile?.bio}
                          />
                        )}
                      </div>
                    </>
                  )}
                  {/* Conditional Statement if small screen */}
                  {isSmScreen ? (
                    <>
                      <div className="info">
                        {/* Star Rating */}
                        <div className="star caption1">
                          <StarIcon />
                          <div><span className="rate ">0 </span>{i18n.label.outOfFive}</div>
                        </div>
                        <Ellipse />
                        {/* Followers */}
                        <Button
                          className="p-0 caption1 btn-followers"
                          color="link"
                          onClick={() => {
                            if ((profile?.followers_count ?? 0) > 0) {
                              setShowFollowersModal(true);
                            }
                          }}
                          disabled={(profile?.followers_count ?? 0) === 0}
                        >
                          {shortNumberFormat(profile?.followers_count)} {LocaleService.getPluralizedTranslation(i18n.label.followers, profile?.followers_count ?? 0, false)}
                        </Button>
                        <Ellipse />
                        <Button
                          className="p-0 caption1 btn-followers"
                          color="link"
                          disabled={(profile?.following_count ?? 0) === 0}
                          onClick={() => {
                            if ((profile?.following_count ?? 0) > 0) {
                              setShowFollowingModal(true);
                            }
                          }}
                        >
                          {shortNumberFormat(profile?.following_count)} {i18n.label.following}
                        </Button>
                        <Ellipse />
                        {/* Posts */}
                        <span className="caption1">{shortNumberFormat(profile?.posts_count)} {LocaleService.getPluralizedTranslation(i18n.label.posts, profile?.posts_count ?? 0, false)}</span>

                        <Ellipse />
                        <span className="caption1">{shortNumberFormat(profile?.views_count)} {LocaleService.getPluralizedTranslation(i18n.label.views, profile?.views_count ?? 0, false)}</span>

                        <Ellipse />
                        <div className="bio-wrapper px-0 mx-0 ">
                          <div className="expand" onClick={() => setShowBioModal(!showBioModal)}>
                            <span style={{ fontSize: '10px' }}>{i18n.label.viewBio}</span>
                            <ChevronRightIcon className="chevron-icon" />
                          </div>
                        </div>
                      </div>
                      {isSmScreen && showBioModal && (
                        <div className="bio-wrapper">
                          <BioModal
                            onClose={() => setShowBioModal(!showBioModal)}
                            description={profile?.bio}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <React.Fragment>
                      <div className="info profile-page-spacing">
                        <div className="star caption1">
                          <StarIcon />
                          <div><span className="rate">0 </span>{i18n.label.outOfFive}</div>
                        </div>
                        <Ellipse />
                        {/* Followers */}
                        <Button
                          className="p-0 caption1 btn-followers"
                          color="link"
                          onClick={() => {
                            if ((profile?.followers_count ?? 0) > 0) {
                              setShowFollowersModal(true);
                            }
                          }}
                          disabled={(profile?.followers_count ?? 0) === 0}

                        >
                          {shortNumberFormat(profile?.followers_count)} {LocaleService.getPluralizedTranslation(i18n.label.followers, profile?.followers_count ?? 0, false)}
                        </Button>
                        <Ellipse />
                        <Button
                          className="p-0 caption1 btn-followers"
                          color="link"
                          disabled={(profile?.following_count ?? 0) === 0}
                          onClick={() => {
                            if ((profile?.following_count ?? 0) > 0) {
                              setShowFollowingModal(true);
                            }
                          }}
                        >
                          {shortNumberFormat(profile?.following_count)} {i18n.label.following}
                        </Button>
                        <Ellipse />
                        {/* Posts */}
                        <span className="caption1">{shortNumberFormat(profile?.posts_count)} {LocaleService.getPluralizedTranslation(i18n.label.posts, profile?.posts_count ?? 0, false)}</span>

                        <Ellipse />
                        <span className="caption1">{shortNumberFormat(profile?.views_count)} {LocaleService.getPluralizedTranslation(i18n.label.views, profile?.views_count ?? 0, false)}</span>

                        <Ellipse />
                        <div className="bio-wrapper px-0 mx-0 ">
                          <div className="expand" onClick={() => setShowBioModal(!showBioModal)}>
                            <span className="caption1">{i18n.label.viewBio}</span>
                            <ChevronRightIcon className="chevron-icon" />
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {/* Conditional Statement if small screen */}
                  {isSmScreen ? (
                    <div className="container mt-2 mx-0 small-col-profile">
                      <div className="row g-3">
                        {/* Check if the user is viewing their own profile */}
                        {user?.id === profile?.id ? (
                          <React.Fragment>
                            {/* "Create" and "Edit Profile" Buttons for Profile Owner */}
                            {/* <div className="col-5 d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                              <Button
                                icon={<PlusIcon />}
                                color="primary"
                                label={i18n.label.contribute}
                                onClick={() => navigate('/posts/create')}
                              />
                            </div> */}

                            <div className="col-4 d-flex justify-content-center align-items-center home-page-create-button-mobile">
                              <Button
                                color="primary"
                                label={i18n.label.editProfile}
                                onClick={() => navigate('/settings')}
                              />
                            </div>

                            <div className="col-4 d-flex justify-content-center align-items-center home-page-create-button-mobile">
                              <Button
                                color="primary"
                                label={i18n.label.managePosts}
                                onClick={() => navigate('/contents')}
                              />
                            </div>
                            <div className="col-4 d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                              <Button
                                color="primary"
                                outline
                                label={i18n.label.share}
                                icon={<SocialShare />}
                                onClick={handleShare}
                              />
                            </div>
                            {/* Dropdown for Profile Owner */}

                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            {/* "Follow/Unfollow" and "Share" Buttons for Guests */}

                            {/* <div className="col-4 d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                              <Button
                                icon={<PlusIcon />}
                                color="primary"
                                label={i18n.label.contribute}
                                onClick={() => navigate('/posts/create')}
                              />
                            </div> */}

                            {profile?.profile?.external_id && !profile?.claimed && (
                              <div className="col d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                                <Button
                                  color="primary"
                                  label={i18n.label.claim}
                                  onClick={() => setShowClaimModal(true)}
                                />
                              </div>
                            )}

                            <div className="col d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                              <FollowButton
                                followId={params?.id || ''}
                                followType="Client"
                                isFollowing={profile?.is_following}
                                isFollower={profile?.is_follower}
                              />
                            </div>

                            <div className="col d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                              <Button
                                color="primary"
                                outline
                                label={i18n.label.share}
                                icon={<SocialShare />}
                                onClick={handleShare}
                              />
                            </div>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="links profile-page-spacing" style={{ width: user?.id === profile?.id || (profile?.profile?.external_id && !profile.claimed) ? '100%' : '50%' }}>
                        {profile?.profile?.external_id && !profile?.claimed && (
                          <Button
                            color="primary"
                            label={i18n.label.claim}
                            onClick={() => setShowClaimModal(true)}
                          />
                        )}
                        {user?.id === profile?.id ? (
                          <React.Fragment>
                            <Button color="primary" label={i18n.label.editProfile} onClick={() => navigate('/settings')} />
                            <Button color="primary" label={i18n.label.managePosts} onClick={() => navigate('/contents')} />
                          </React.Fragment>
                        ) : (
                          <FollowButton
                            followId={params.id || ''}
                            followType="Client"
                            isFollowing={profile?.is_following}
                            isFollower={profile?.is_follower}

                          />
                        )}
                        <Button color="primary" outline label={i18n.label.share} icon={<SocialShare />} onClick={handleShare} />
                      </div>
                    </div>
                  )}

                </Col>
              </Row>

              { /* Scrolling pills for timeline, my rewards, etc. */}
              <div className="scrolling-pills-timeline d-flex overflow-auto gap-2 mb-4">
                <Nav pills className="flex-nowrap gap-2">
                  {tabs.map(tab => (
                    <NavItem key={tab.id}>
                      <NavLink
                        active={activeTab === tab.id}
                        className="tab-link text-nowrap d-flex justify-content-center align-items-center"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </div>

              {/* Timeline Section */}
              {(activeTab !== 'timeline') && (
                <h1 className="d-flex justify-content-center align-items-center mt-5">{i18n.label.upcoming}</h1>
              )}
            </>
          )}
      </Container>

      {activeTab === 'timeline' && (
        <ResizableTimeline
          mapComponent={(
            <TimelineMap
              markers={markers}
              loading={isLoading}
              startDate={startDate}
              endDate={endDate}
              onSelectTimeRange={(data) => setQuery((s: any) => ({ ...s, ...data }))}
            />
          )}
          timeline={(
            <div>
              {profile?.is_private && profile?.id !== user?.id ? (
                <PrivateTimeline />
              ) : (
                <AccordionTimeline
                  request={getProfileTimelineRequest}
                  query={{
                    ...query,
                    id: params?.id ?? user?.id,
                  }}
                  onChangeTimeline={setTimelineMarkers}
                  onChangeVisibleItems={setVisibleTimelineMarkers}
                  onChangeDates={setDates}
                  defaultTimescale="24-h"
                  TimelineComponent={Timeline}
                />
              )}
            </div>
          )}
        />
      )}

      <ClaimModal
        show={showClaimModal}
        toggle={() => setShowClaimModal(s => !s)}
      />

      <FollowersModal
        show={showFollowersModal}
        toggle={() => setShowFollowersModal(s => !s)}
        id={params?.id || user?.id}
      />

      <FollowingModal
        show={showFollowingModal}
        toggle={() => setShowFollowingModal(s => !s)}
        id={params?.id || user?.id}
      />
    </div>
  );
}

export default ProfilePage;
