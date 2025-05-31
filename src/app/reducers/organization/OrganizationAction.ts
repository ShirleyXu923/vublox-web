import {
  generateAction,
  generateDeleteAction,
  generateGetAction,
  generatePostAction,
  generatePutAction,
} from '@services/ActionDispatcher';

import {
  createOrganizationAction, updateOrganizationAction,
  getOrganizationAction, getOrganizationsAction,
  followOrganizationAction, unfollowOrganizationAction,
  getCreatedPostsAction, changeOrganizationAction,
  getEventsByOrganizationAction, searchAllOrganizationsAction,
  getTopEarningsPostsAction, getAnalyticsAction,
  getTimelineByOrganizationAction,
  createOrganizationTimeblockAction,
  publishOrganizationAction,
  getOrganizationTimelineAction,
  deleteOrganizationTimelineAction,
  getFeaturedOrganizationsAction,
} from './OrganizationActionConfig';

// action request dispatchers
const changeOrganizationRequest = (organization: any) => generateAction(
  // action name
  changeOrganizationAction,
  // data
  organization,
);

const createOrganizationRequest = (data: any) => generatePostAction(
  // action name
  createOrganizationAction,
  // url
  'organizations',
  data,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  },
);

const createOrganizationTimeblockRequest = (data: any) => generatePostAction(
  // action name
  createOrganizationTimeblockAction,
  // url
  'organizations/timeblock',
  data,
);

const updateOrganizationRequest = (code: string, data: any) => generatePutAction(
  // action name
  updateOrganizationAction,
  // url
  `organizations/${code}/update`,
  data,
);

const publishOrganizationRequest = (code?: string) => generatePutAction(
  // action name
  publishOrganizationAction,
  // url
  `organizations/${code}`,
);

const getOrganizationRequest = (code: string) => generateGetAction(
  // action name
  getOrganizationAction,
  // url
  `organizations/${code}`,
);

const getOrganizationsRequest = (queryParams: any = {}) => generateGetAction(
  // action name
  getOrganizationsAction,
  // url
  'organizations',
  { queryParams },
);

const getFeaturedOrganizationsRequest = (queryParams: any = {}) => generateGetAction(
  // action name
  getFeaturedOrganizationsAction,
  'organizations/featured',
  { queryParams },
);

const getOrganizationTimelineRequest = (queryParams: any = {}) => generateGetAction(
  // action name
  getOrganizationTimelineAction,
  // url
  `organizations/timeline/${queryParams.id}`,
  // query parameters
  { queryParams },
);

const deleteOrganizationTimelineRequest = (code: string) => generateDeleteAction(
  // action name
  deleteOrganizationTimelineAction,
  // url
  `organizations/timeline/${code}`,
);

const searchAllOrganizationsRequest = (data: any = {}) => generateGetAction(
  // action name
  searchAllOrganizationsAction,
  // url
  'organizations/search',
  { queryParams: data },
);

const followOrganizationRequest = (id: string) => generatePutAction(
  // action name
  followOrganizationAction,
  // url
  `organizations/${id}/follow`,
);

const unfollowOrganizationRequest = (id: string) => generateDeleteAction(
  // action name
  unfollowOrganizationAction,
  // url
  `organizations/${id}/follow`,
);

const getCreatedPostsRequest = (data: any) => generateGetAction(
  // action name
  getCreatedPostsAction,
  // url
  `organizations/${data.id}/created-nfts`,
  { queryParams: data },
);

const getTopEarningsPostsRequest = (data: any) => generateGetAction(
  // action name
  getTopEarningsPostsAction,
  // url
  `organizations/${data.id}/top-earnings`,
  { queryParams: data },
);

const getEventsByOrganizationRequest = (organizationId: string) => generateGetAction(
  // action name
  getEventsByOrganizationAction,
  // url
  `organizations/${organizationId}/events`,
);

const getTimelineByOrganizationRequest = (code?: string, queryParams?: any) => generateGetAction(
  // action name
  getTimelineByOrganizationAction,
  // url
  `organizations/${code}/timeblock`,
  { queryParams },
);

const getAnalyticsRequest = (data: any) => generateGetAction(
  // action name
  getAnalyticsAction,
  // url
  `organizations/${data.id}/analytics`,
  { queryParams: data },
);

// register actions here
export {
  // normal dispatch
  changeOrganizationRequest,

  // async (request) dispatch
  createOrganizationRequest,
  createOrganizationTimeblockRequest,
  getFeaturedOrganizationsRequest,
  updateOrganizationRequest,
  publishOrganizationRequest,
  getOrganizationsRequest,
  getOrganizationRequest,
  followOrganizationRequest,
  unfollowOrganizationRequest,
  deleteOrganizationTimelineRequest,
  getCreatedPostsRequest,
  getTopEarningsPostsRequest,
  getEventsByOrganizationRequest,
  getTimelineByOrganizationRequest,
  searchAllOrganizationsRequest,
  getAnalyticsRequest,
  getOrganizationTimelineRequest,
};
