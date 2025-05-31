/* eslint-disable react/jsx-props-no-spreading */
// import PropTypes from 'prop-types';
import { lazy, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  matchRoutes,
  Navigate,
  Outlet,
  Route, useLocation,
} from 'react-router-dom';
import { useTracking } from 'react-tracking';

import { IRootState } from '@app/store';
import { clearUserTokenRequest } from '@reducers/auth/AuthAction';
import useDeepEffect from '@shared/hooks/useDeepEffect';
import DashboardLayout from '@shared/layout/dashboard/DashboardLayout';
import LandingLayout from '@shared/layout/landing/LandingLayout';

const AboutPage = lazy(() => import('./about-page/AboutPage'));
const AnalyticsPage = lazy(() => import('./analytics-page/AnalyticsPage'));
const ContactPage = lazy(() => import('./contact-page/ContactPage'));
const ContentManager = lazy(() => import('./content-manager/ContentManager'));
const CookiePolicyPage = lazy(() => import('./cookie-policy/CookiePolicyPage'));
const CreatePostPage = lazy(() => import('./create-post/CreatePostPage'));
const CreateEventPage = lazy(() => import('./events/pages/create-event/CreateEventPage'));
const EditEventPage = lazy(() => import('./events/pages/edit-event/EditEventPage'));
const EventPage = lazy(() => import('./events/pages/event-page/EventPage'));
const HomePage = lazy(() => import('./home/HomePage'));
const Instructions = lazy(() => import('./instructions/Instructions'));
const ContentTypeInstruction = lazy(() => import('./instructions/components/ContentTypeInstruction'));
const ContributeInstruction = lazy(() => import('./instructions/components/ContributeInstruction'));
const CreateEventInstruction = lazy(() => import('./instructions/components/CreateEventInstruction'));
const CreateOrganizationInstruction = lazy(() => import('./instructions/components/CreateOrganizationInstruction'));
const CreatePostInstruction = lazy(() => import('./instructions/components/CreatePostInstruction'));
const CreateTimelineInstruction = lazy(() => import('./instructions/components/CreateTimelineInstruction'));
const LandingPage = lazy(() => import('./landing/LandingPage'));
const LocationPage = lazy(() => import('./location-page/LocationPage'));
const NotificationPage = lazy(() => import('./notification-page/NotificationPage'));
const OnboardingPage = lazy(() => import('./onboarding/OnboardingPage'));
const CreateOrganization = lazy(() => import('./organizations/pages/create-organization/CreateOrganization'));
const EditOrganization = lazy(() => import('./organizations/pages/edit-organization/EditOrganization'));
const OrganizationPage = lazy(() => import('./organizations/pages/organization-page/OrganizationPage'));
const OrganizationTimeline = lazy(() => import('./organizations/pages/organization-timeline/OrganizationTimeline'));
const PostPage = lazy(() => import('./posts/pages/post-page/PostPage'));
const PrivacyPolicyPage = lazy(() => import('./privacy-policy/PrivacyPolicyPage'));
const ProfilePage = lazy(() => import('./profile-page/ProfilePage'));
const SettingsPage = lazy(() => import('./settings/SettingsPage'));
const TermsAndConditionsPage = lazy(() => import('./terms-and-conditions/TermsAndConditionsPage'));
const CreateTimeblocks = lazy(() => import('./timelines/pages/create-timeblocks/CreateTimeblocks'));
const CreateTimeline = lazy(() => import('./timelines/pages/create-timeline/CreateTimeline'));
const EditTimeline = lazy(() => import('./timelines/pages/edit-timeline/EditTimeline'));
const TimelinePage = lazy(() => import('./timelines/pages/timeline-page/TimelinePage'));
const ViewAllPage = lazy(() => import('./view-all/ViewAllPage'));
const WorldEventsPage = lazy(() => import('./world-events/WorldEventsPage'));

function AuthRoute() {
  const dispatch = useDispatch<any>();
  const isLoggedIn = useSelector((state: IRootState) => !!state.Auth.accessToken);
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/home" state={{ from: location }} />;
  }

  const bc = new BroadcastChannel('vublox_channel');

  bc.onmessage = (event) => {
    if (event.data === 'logout') {
      dispatch(clearUserTokenRequest());

      bc.close();
    }
  };

  return <Outlet />;
}

function OnboardingRoute() {
  const isLoggedIn = useSelector((state: IRootState) => !!state.Auth.accessToken);
  const hasInterests = useSelector((state: IRootState) => (state.Auth.user as any).interests
    ?.length > 0);
  const location = useLocation();
  const { trackEvent } = useTracking();
  const [ trackingRoutes ] = useState([
    { path: '/events/:id', type: 'Event' },
    { path: '/posts/:id', type: 'Post' },
    { path: '/organizations/:id', type: 'Organization' },
    { path: '/timelines/:id', type: 'Timeline' },
    { path: '/profile/:id', type: 'Client' },
  ]);
  const matches = matchRoutes(trackingRoutes, location.pathname);

  useDeepEffect(() => {
    if (matches?.[0] && matches[0].params?.id?.length === 36) {
      trackEvent({
        page_type: matches[0].route.type,
        page_id: matches[0].params.id,
        type: 'view',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ matches ]);

  if (!isLoggedIn || (isLoggedIn && hasInterests)
     || (isLoggedIn && !hasInterests && location.pathname === '/onboarding')) {
    return <Outlet />;
  }

  return <Navigate to="/onboarding" state={{ from: location }} />;
}

function ClientRouter() {
  return (
    <Route element={<OnboardingRoute />}>
      {/* With TopNav */}
      <Route element={<DashboardLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/world-events" element={<WorldEventsPage />} />
        <Route path="/contact-us" element={<ContactPage />} />

        {/* Private Routes */}
        <Route element={<AuthRoute />}>
          <Route path="/analytics" element={<AnalyticsPage />} />
          {/* Notifications */}
          <Route path="/notifications" element={<NotificationPage />} />
          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Content Manager */}
          <Route path="/contents" element={<ContentManager />} />

          {/* Events */}
          <Route path="/events">
            <Route path="create" element={<CreateEventPage />} />
            <Route path=":id/edit" element={<EditEventPage />} />
          </Route>
          {/* Posts */}
          <Route path="/posts">
            <Route path="create" element={<CreatePostPage />} />
          </Route>
          {/* Organizations */}
          <Route path="/organizations/create" element={<CreateOrganization />} />
          <Route path="/organizations/:id/edit" element={<EditOrganization />} />
          <Route path="/organizations/:id/timelines" element={<OrganizationTimeline />} />
          {/* Timelines */}
          <Route path="/timelines">
            <Route path="create" element={<CreateTimeline />} />
            <Route path=":id/edit" element={<EditTimeline />} />
            <Route path=":id/timeblocks" element={<CreateTimeblocks />} />
          </Route>
          {/* Instructions */}
          <Route path="/instructions">
            <Route path="all" element={<Instructions />} />
            <Route path="create-post" element={<CreatePostInstruction />} />
            <Route path="create-event" element={<CreateEventInstruction />} />
            <Route path="create-organization" element={<CreateOrganizationInstruction />} />
            <Route path="create-timeline" element={<CreateTimelineInstruction />} />
            <Route path="contribute" element={<ContributeInstruction />} />
            <Route path="content-type" element={<ContentTypeInstruction />} />
          </Route>

          {/* Locations */}

          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Public Routes */}
        <Route path="/organizations/:id" element={<OrganizationPage />} />
        <Route path="/locations/:slug" element={<LocationPage />} />
        <Route path="/timelines/:id" element={<TimelinePage />} />
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/world-events/all" element={<ViewAllPage />} />
        <Route path="/:type/:id/all" element={<ViewAllPage />} />
        <Route path="/timelines/:id/:parentId" element={<TimelinePage />} />
        <Route path="/about-us" element={<AboutPage />} />
      </Route>

      {/* Without TopNav */}
      <Route element={<LandingLayout />}>
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route index element={<LandingPage />} />
      </Route>
      <Route path="/events/:id" element={<EventPage />} />

      {/* Private Routes */}
      <Route element={<AuthRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>
    </Route>
  );
}

ClientRouter.propTypes = {

};

export default ClientRouter;
