/* eslint-disable max-len */
import classNames from 'classnames';
import React, {
  useEffect, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import {
  useLocation,
  useNavigate,
  // useNavigate,
  useParams,
} from 'react-router-dom';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';

import { useShareLinkModal } from '@app/providers/share-provider/ShareProvider';
import { IRootState } from '@app/store';
import appConfig from '@config/app';
import { getLocationRequest, getLocationTimelineRequest } from '@reducers/location/LocationAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { Button } from '@shared/buttons/Button';
import { FollowButton } from '@shared/buttons/follow-button';
import { AccordionTimeline } from '@shared/components/AccordionTimeline';
import { Timeline } from '@shared/components/AccordionTimeline/components/timeline';
import ResizableTimeline from '@shared/components/ResizableTimeline/ResizableTimeline';
import TimelineMap from '@shared/components/TimelineMap/TimelineMap';
import useTimelineMap from '@shared/hooks/useTimelineMap';
import Ellipse from '@shared/icons/Ellipse';
import SocialShare from '@shared/icons/SocialShare';

import './LocationPage.scss';

import LocationPagePlaceholder from './LocationPagePlaceholder';

function LocationPage() {
  const i18n = LocaleService.getTranslations('locationPage');
  const dispatch = useDispatch<any>();
  const params = useParams();
  const location = useSelector((state: IRootState) => state.Location.location);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ query, setQuery ] = useState<any>({});
  const { toggle: toggleShare, setLink } = useShareLinkModal();
  const isMobileScreen = useMediaQuery({ query: '(max-width: 576px)' });
  const handleShare = () => {
    setLink(`${appConfig.baseUrl}/locations/${params?.slug}`);
    toggleShare(true);
  };
  const browserLocation = useLocation();
  const navigate = useNavigate();
  const {
    markers, startDate, endDate, setDates, setTimelineMarkers, setVisibleTimelineMarkers,
  } = useTimelineMap();

  const loadData = async () => {
    setIsLoading(true);
    try {
      await dispatch(getLocationRequest(params?.slug || '')).$promise;
    } catch (err) {
      handleError(err, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  const initialLoad = async () => {
    setIsLoading(true);
    await loadData();
    setIsLoading(false);
  };

  useEffect(() => {
    initialLoad();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ browserLocation ]);

  return (
    <div className="full-container">
      <Container className="location-page px-0">
        {isLoading
          ? (
            <Container className="location-page-wrapper">
              <LocationPagePlaceholder />
            </Container>
          )
          : (
            <Container className="location-page-wrapper">
              {/* Profile Section */}
              <Row className={classNames('profile-section', { 'mt-3': isMobileScreen })}>
                <Col md={12}>
                  <h2 className={classNames({ 'mb-1': isMobileScreen, s3: isMobileScreen })}>
                    {location?.name}
                  </h2>

                  <div className="bio">
                    <div className={classNames('b3', { b5: isMobileScreen, 'text-truncate': isMobileScreen })}>
                      {location?.address}
                    </div>
                  </div>
                  <div className="info mb-1">
                    {/* Followers */}
                    <span className="caption1">{location?.followers_count} {LocaleService.getPluralizedTranslation(i18n.label.followers, location?.followers_count ?? 0, false)}</span>
                    <Ellipse />
                    {/* Posts */}
                    <span className="caption1">{location?.posts_count} {LocaleService.getPluralizedTranslation(i18n.label.posts, location?.posts_count ?? 0, false)}</span>
                  </div>
                </Col>

              </Row>
              <div className={classNames('links mb-5', { 'mt-3': !isMobileScreen })}>
                <div className="row g-3 d-flex justify-content-around">
                  <div className="col-6 d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                    <FollowButton
                      followId={location?.id}
                      followType="Location"
                      isFollowing={location?.is_following}
                    />
                  </div>
                  { /*  <Button color="primary" outline label={i18n.label.viewInWorldEvents} onClick={() => navigate('/world-events')} /> */}

                  <div className="col-6 d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                    <Button
                      color="primary"
                      icon={<SocialShare />}
                      label={i18n.label.share}
                      onClick={handleShare}
                      outline
                    />
                  </div>
                </div>
              </div>

            </Container>
          )}
      </Container>

      <ResizableTimeline
        mapComponent={(
          <TimelineMap
            markers={markers}
            startDate={startDate}
            endDate={endDate}
            location={location}
            loading={isLoading}
            onSelectTimeRange={(data) => setQuery((s: any) => ({ ...s, ...data }))}
          />
        )}
        timeline={(
          <AccordionTimeline
            request={getLocationTimelineRequest}
            createPostLink={`/posts/create?postable_id=${location?.id}&postable_type=Location#step-1`}
            query={{
              ...query,
              id: params?.slug,
            }}
            onChangeTimeline={setTimelineMarkers}
            onChangeVisibleItems={setVisibleTimelineMarkers}
            onChangeDates={setDates}
            TimelineComponent={Timeline}
          />
        )}
      />
    </div>
  );
}

export default LocationPage;
