import {
  generateAction,
  generateGetAction,
  generatePostAction,
} from '@services/ActionDispatcher';

import {
  dontShowAdultTooltipAction,
  getMediaMetatagsAction,
  getMetatagsAction, getUsersAndOrganizationsAction, saveClientInterestsAction,
  savePageViewAction, setThemeAction,
  setTimelineSizeAction,
} from './AppActionConfig';

// action request dispatchers
const getMetatagsRequest = (queryParams: any) => generateGetAction(
  // action name
  getMetatagsAction,
  // url
  'metatags',
  { queryParams },
);

const getMediaMetatagsRequest = (data: any) => generatePostAction(
  // action name
  getMediaMetatagsAction,
  // url
  'metatags/media',
  data,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  },
);

const saveClientInterestsRequest = (data: any) => generatePostAction(
  // action name
  saveClientInterestsAction,
  // url
  'client-interests',
  data,
);

const getUsersAndOrganizationsRequest = (queryParams: any) => generateGetAction(
  // action name
  getUsersAndOrganizationsAction,
  // url
  'users/users-organizations',
  { queryParams },
);

const setThemeDispatch = (payload: string) => generateAction(
  // action name
  setThemeAction,
  payload,
);

const dontShowAdultTooltipDispatch = (payload: boolean) => generateAction(
  // action name
  dontShowAdultTooltipAction,
  payload,
);

const savePageViewRequest = (data: any) => generatePostAction(
  // action name
  savePageViewAction,
  // url
  'page-views',
  {
    ...data,
    device_uuid: localStorage.getItem('DEVICE_UUID'),
    ip_address: localStorage.getItem('IP_ADDRESS'),
  },
);

const setTimelineSizeDispatch = (payload: any) => generateAction(
  // action name
  setTimelineSizeAction,
  payload,
);

// register actions here
export {
  // normal dispatch
  setThemeDispatch,
  setTimelineSizeDispatch,

  // async (request) dispatch
  getMetatagsRequest,
  getMediaMetatagsRequest,
  saveClientInterestsRequest,
  getUsersAndOrganizationsRequest,
  dontShowAdultTooltipDispatch,
  savePageViewRequest,
};
