/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

// Action Declarations
// Suggested Action Name Standard: ORG_MODULE_ACTION_ANY
export const getMetatagsAction = createAction('VUBLOX_METATAG_GET_METATAGS');
export const getMediaMetatagsAction = createAction('VUBLOX_METATAG_GET_MEDIA_METATAGS');
export const saveClientInterestsAction = createAction('VUBLOX_SAVE_CLIENT_INTERESTS');
export const getUsersAndOrganizationsAction = createAction('VUBLOX_GET_USERS_AND_ORGANIZATIONS');
export const setThemeAction = createAction('YEAR_GLANCE_SET_THEME');
export const dontShowAdultTooltipAction = createAction('VUBBLOX_SET_TOOLTIP');
export const savePageViewAction = createAction('VUBLOX_SAVE_PAGE_VIEW');
export const setTimelineSizeAction = createAction('VUBLOX_SET_TIMELINE_SIZE');
