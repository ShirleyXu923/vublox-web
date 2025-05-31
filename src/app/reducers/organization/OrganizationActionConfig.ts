/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

// Action Declarations
// Suggested Action Name Standard: ORG_MODULE_ACTION_ANY
export const createOrganizationAction = createAction('VUBLOX_ORGANIZATION_CREATE_ORGANIZATION');
export const createOrganizationTimeblockAction = createAction('VUBLOX_ORGANIZATION_CREATE_TIMEBLOCK');
export const updateOrganizationAction = createAction('VUBLOX_ORGANIZATION_UPDATE_ORGANIZATION');
export const publishOrganizationAction = createAction('VUBLOX_ORGANIZATION_PUBLISH_ORGANIZATION');
export const getOrganizationsAction = createAction('VUBLOX_ORGANIZATION_GET_ORGANIZATIONS');
export const getFeaturedOrganizationsAction = createAction('VUBLOX_ORGANIZATION_GET_FEATURED_ORGANIZATIONS');
export const getOrganizationAction = createAction('VUBLOX_ORGANIZATION_GET_ORGANIZATION');
export const getOrganizationTimelineAction = createAction('VUBLOX_ORGANIZATION_GET_ORGANIZATION_TIMELINE');
export const followOrganizationAction = createAction('VUBLOX_ORGANIZATION_FOLLOW_ORGANIZATION');
export const unfollowOrganizationAction = createAction('VUBLOX_ORGANIZATION_UNFOLLOW_ORGANIZATION');
export const deleteOrganizationTimelineAction = createAction('VUBLOX_ORGANIZATION_DELETE_ORGANIZATION_TIMEBLOCK');

export const getCreatedPostsAction = createAction('VUBLOX_ORGANIZATION_GET_CREATED_POSTS');
export const getTopEarningsPostsAction = createAction('VUBLOX_ORGANIZATION_GET_TOP_EARNINGS_POSTS');
export const changeOrganizationAction = createAction('VUBLOX_ORGANIZATION_CHANGE_ORGANIZATION');
export const getEventsByOrganizationAction = createAction('VUBLOX_ORGANIZATION_GET_EVENTS_BY_ORGANIZATION');
export const getTimelineByOrganizationAction = createAction('VUBLOX_ORGANIZATION_GET_TIMELINE_BY_ORGANIZATION');
export const searchAllOrganizationsAction = createAction('VUBLOX_ORGANIZATION_SEARCH_ALL_ORGANIZATIONS');

export const getAnalyticsAction = createAction('VUBLOX_ORGANIZATION_GET_ANALYTICS');
