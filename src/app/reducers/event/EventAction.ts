import {
  generateDeleteAction,
  generateGetAction,
  generatePostAction,
  generatePutAction,
} from '@services/ActionDispatcher';

import {
  createEventAction,
  deleteEventAction,
  getEventAction,
  getCoCreatorsAction,
  getEventTimelineAction,
  getEventsAction,
  getFeauredEventsAction,
  getMyEventsAction,
  getServerTimeAction,
  getUpcomingEventsAction,
  updateEventAction,
  getInvitedAction,
  addInviteAction,
  getNonInvitedAction,
  getEventStatisticsAction,
  acceptInviteAction,
  declineInviteAction,
} from './EventActionConfig';

// action request dispatchers
const createEventRequest = (data: any) => generatePostAction(
  // action name
  createEventAction,
  // url
  'events',
  data,
);

const getEventsRequest = (queryParams: any) => generateGetAction(
  // action name
  getEventsAction,
  // url
  'events',
  { queryParams },
);

const getMyEventsRequest = (queryParams: any) => generateGetAction(
  // action name
  getMyEventsAction,
  // url
  'events/my-events',
  { queryParams },
);

const updateEventRequest = (code: string, data: any) => generatePutAction(
  // action name
  updateEventAction,
  // url
  `events/${code}`,
  // data
  data,
);

const getEventRequest = (code: string, queryParams = {}) => generateGetAction(
  // action name
  getEventAction,
  // url
  `events/${code}`,
  // params
  { queryParams },
);

const getEventStatisticsRequest = (code: string, queryParams = {}) => generateGetAction(
  // action name
  getEventStatisticsAction,
  // url
  `events/${code}/statistics`,
  // params
  { queryParams },
);

const getEventTimelineRequest = (queryParams: any) => generateGetAction(
  // action name
  getEventTimelineAction,
  // url
  `events/${queryParams.id}/timeline`,
  // params
  { queryParams },
);

const getFeaturedEventsRequest = (queryParams: any) => generateGetAction(
  // action name
  getFeauredEventsAction,
  // url
  'events/featured',
  { queryParams },
);

const getUpcomingEventsRequest = (queryParams: any) => generateGetAction(
  // action name
  getUpcomingEventsAction,
  // url
  'events/upcoming',
  { queryParams },
);

const getCoCreatorsRequest = (queryParams: any) => generateGetAction(
  // action name
  getCoCreatorsAction,
  // url
  'events/co-creators',
  { queryParams },
);

const getInvited = (queryParams: any, eventId: any) => generateGetAction(
  // action name
  getInvitedAction,
  // url
  `events/${eventId}/invited`,
  { queryParams },
);
const deleteInvitee = (eventId: any, inviteeId: any) => generateDeleteAction(
  // action name
  getInvitedAction,
  // url
  `events/${eventId}/invitee/${inviteeId}`,
);

const addInvite = (eventId: any, data: any) => generatePostAction(
  // action name
  addInviteAction,
  // url
  `events/${eventId}/invites`,
  data,
);

const acceptInvite = (eventId: any, inviteId: any, data?: any) => generatePutAction(
  // action name
  acceptInviteAction,
  // url
  `events/${eventId}/invites/${inviteId}/accept`,
  data,
);

const declineInvite = (eventId: any, inviteId: any, data?: any) => generatePutAction(
  // action name
  declineInviteAction,
  // url
  `events/${eventId}/invites/${inviteId}/decline`,
  data,
);

const getNonInvited = (queryParams: any, eventId: any) => generateGetAction(
  // action name
  getNonInvitedAction,
  // url
  `events/${eventId}/non-invited`,
  { queryParams },
);

const getEventTagsRequest = (queryParams: any) => generateGetAction(
  // action name
  getFeauredEventsAction,
  // url
  'events/tags',
  { queryParams },
);

const deleteEventRequest = (code: string) => generateDeleteAction(
  // action name
  deleteEventAction,
  `events/${code}`,
);

const getServerTimeRequest = () => generateGetAction(
  // action name
  getServerTimeAction,
  // url
  'server-time',
);

// register actions here
export {
  // normal dispatch

  // async (request) dispatch
  createEventRequest,
  getEventRequest,
  getEventStatisticsRequest,
  getEventTimelineRequest,
  getEventsRequest,
  updateEventRequest,
  getMyEventsRequest,
  getCoCreatorsRequest,
  getFeaturedEventsRequest,
  getUpcomingEventsRequest,
  getEventTagsRequest,
  deleteEventRequest,
  getServerTimeRequest,
  getInvited,
  getNonInvited,
  addInvite,
  deleteInvitee,
  declineInvite,
  acceptInvite,
};
