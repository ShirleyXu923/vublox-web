/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

// Action Declarations
// Suggested Action Name Standard: ORG_MODULE_ACTION_ANY
export const getLocationsAction = createAction('VUBLOX_LOCATION_GET_LOCATIONS');
export const getLocationAction = createAction('VUBLOX_LOCATION_GET_LOCATION');
export const getLocationTimelineAction = createAction('VUBLOX_LOCATION_GET_TIMELINE');
