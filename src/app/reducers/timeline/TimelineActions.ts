/* eslint-disable import/prefer-default-export */
import {
  generateDeleteAction,
  generateGetAction,
  generatePostAction,
  generatePutAction,
} from '@services/ActionDispatcher';

import {
  createTimelineAction,
  createTimelineTimeblockAction,
  searchTimelineAction,
  getTimelineTimeblockablesAction,
  publishTimelineAction,
  getTimelineAction,
  getTimelinesAction,
  uploadImageAction,
  updateTimelineAction,
  moveTimelineCardAction,
  getMyTimelinesAction,
  unPublishTimelineAction,
  getFeaturedTimelinesAction,
  getTimeblockablesAction,
  deleteTimeblockableAction,
  getTimelineTimelineAction,
  getWorldTimelineAction,
  contributeToTimelineAction,
} from './TimelineActionConfig';

const getFeaturedTimelinesRequest = (queryParams: any) => generateGetAction(
  // action name
  getFeaturedTimelinesAction,
  // url
  'timelines/featured',
  // data
  { queryParams },
);

const createTimelineRequest = (data: any) => generatePostAction(
  // action name
  createTimelineAction,
  // url
  'timelines',
  // data
  data,
);

const publishTimelineRequest = (code: string) => generatePutAction(
  // action name
  publishTimelineAction,
  // url
  `timelines/${code}`,
);

const unPublishTimelineRequest = (data: any) => generatePostAction(
  // action name
  unPublishTimelineAction,
  // url
  'timelines/un-publish',
  data,
);

const updateTimelineRequest = (code: string, data: any) => generatePutAction(
  // action name
  updateTimelineAction,
  // url
  `timelines/${code}/update`,
  data,
);

const uploadImageRequest = (data: any) => generatePostAction(
  // action name
  uploadImageAction,
  // url
  'timelines/upload',
  // data
  data,
);

const moveTimelineCardRequest = (code: any, data: any) => generatePutAction(
  // action name
  moveTimelineCardAction,
  // url
  `timelines/${code}/move`,
  // data
  data,
);

const getTimelineRequest = (code: any, queryParams: any = {}) => generateGetAction(
  // action name
  getTimelineAction,
  // url
  `timelines/${code}`,
  // Query Parameters
  { queryParams },
);

const getTimelineTimelineRequest = (queryParams: any = {}) => generateGetAction(
  // action name
  getTimelineTimelineAction,
  // url
  `timelines/${queryParams.id}/timeline`,
  // Query Parameters
  { queryParams },
);

const getMyTimelinesRequest = (queryParams?: any) => generateGetAction(
  // action name
  getMyTimelinesAction,
  // url
  'timelines/my-timelines',
  // Query Parameters
  { queryParams },
);

const createTimelineTimelockRequest = (data: any) => generatePostAction(
  // action name
  createTimelineTimeblockAction,
  // url
  'timelines/timeblock',
  // data
  data,
);

const searchTimelineRequest = (code: string, page = 1) => generateGetAction(
  // action name
  searchTimelineAction,
  // url
  `timelines/search/${code}?page=${page}`,
);

const getTimelineTimeblockablesRequest = (code: string, queryParams: any) => generateGetAction(
  // action name
  getTimelineTimeblockablesAction,
  // url
  `timelines/timeblocks/${code}`,
  { queryParams },
);

const getTimelinesRequest = (queryParams: any) => generateGetAction(
  // action name
  getTimelinesAction,
  // url
  'timelines',
  { queryParams },
);

const getTimeblockablesRequest = (code: string, queryParams?: any) => generateGetAction(
  // action name
  getTimeblockablesAction,
  // url
  `timelines/timeblockables/${code}`,
  { queryParams },
);

const deleteTimeblockableRequest = (code: string) => generateDeleteAction(
  // action name
  deleteTimeblockableAction,
  // url
  `timelines/timeblockables/${code}`,
);

const getWorldTimelineRequest = (queryParams: any = {}) => generateGetAction(
  // action name
  getWorldTimelineAction,
  // url
  'timelines/world',
  // Query Parameters
  { queryParams },
);

const contributeToTimelineRequest = (data: any) => generatePostAction(
  // action name
  contributeToTimelineAction,
  // url
  'timelines/contribute',
  // data
  data,
);

export {
  getFeaturedTimelinesRequest,
  createTimelineRequest,
  updateTimelineRequest,
  publishTimelineRequest,
  unPublishTimelineRequest,
  uploadImageRequest,
  getTimelineRequest,
  getMyTimelinesRequest,
  searchTimelineRequest,
  createTimelineTimelockRequest,
  getTimelineTimeblockablesRequest,
  getTimelinesRequest,
  moveTimelineCardRequest,
  getTimeblockablesRequest,
  deleteTimeblockableRequest,
  getTimelineTimelineRequest,
  getWorldTimelineRequest,
  contributeToTimelineRequest,
};
