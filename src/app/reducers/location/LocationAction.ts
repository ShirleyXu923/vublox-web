import {
  generateGetAction,
} from '@services/ActionDispatcher';

import {
  getLocationAction,
  getLocationsAction,
  getLocationTimelineAction,
} from './LocationActionConfig';

// action request dispatchers
const getLocationsRequest = (queryParams: any) => generateGetAction(
  // action name
  getLocationsAction,
  // url
  'locations',
  { queryParams },
);

const getLocationRequest = (code: string) => generateGetAction(
  // action name
  getLocationAction,
  // url
  `locations/${code}`,
);

const getLocationTimelineRequest = (queryParams: any) => generateGetAction(
  // action name
  getLocationTimelineAction,
  // url
  `locations/${queryParams.id}/timeline`,
  { queryParams },
);

// register actions here
export {
  // normal dispatch

  // async (request) dispatch
  getLocationsRequest,
  getLocationRequest,
  getLocationTimelineRequest,
};
