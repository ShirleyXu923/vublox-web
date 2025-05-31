import {
  generatePostAction,
} from '@services/ActionDispatcher';

import {
  createLeadAction,
} from './LeadActionConfig';

// action request dispatchers
const createLeadRequest = (data: any) => generatePostAction(
  // action name
  createLeadAction,
  // url
  'leads',
  data,
);

// register actions here
export {
  // normal dispatch

  // async (request) dispatch
  // eslint-disable-next-line import/prefer-default-export
  createLeadRequest,
};
