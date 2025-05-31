/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

// Action Declarations
// Suggested Action Name Standard: ORG_MODULE_ACTION_ANY
export const createEventAction = createAction('VUBLOX_EVENT_CREATE_EVENT');
export const getEventAction = createAction('VUBLOX_EVENT_GET_EVENT');
export const getEventStatisticsAction = createAction('VUBLOX_EVENT_GET_EVENT_STATISTICS');
export const getEventTimelineAction = createAction('VUBLOX_EVENT_GET_EVENT_TIMELINE');
export const getEventsAction = createAction('VUBLOX_EVENT_GET_EVENTS');
export const getMyEventsAction = createAction('VUBLOX_EVENT_GET_MY_EVENTS');
export const updateEventAction = createAction('VUBLOX_EVENT_UPDATE_EVENT');
export const deleteEventAction = createAction('VUBLOX_EVENT_DELETE_EVENT');
export const getFeauredEventsAction = createAction('VUBLOX_EVENT_GET_FEATURED_EVENTS');
export const getUpcomingEventsAction = createAction('VUBLOX_EVENT_GET_UPCOMING_EVENTS');
export const getEventTagsAction = createAction('VUBLOX_EVENT_GET_EVENT_TAGS');
export const getServerTimeAction = createAction('VUBLOX_EVENT_GET_SERVER_TIME');
export const getCoCreatorsAction = createAction('VUBLOX_EVENT_GET_CO_CREATORS');
export const getInvitedAction = createAction('VUBLOX_EVENT_GET_INVITED');
export const getNonInvitedAction = createAction('VUBLOX_EVENT_GET_NONINVITED');
export const addInviteAction = createAction('VUBLOX_EVENT_CREATE_INVITE');
export const acceptInviteAction = createAction('VUBLOX_EVENT_ACCEPT_INVITE');
export const declineInviteAction = createAction('VUBLOX_EVENT_DECLINE_INVITE');
