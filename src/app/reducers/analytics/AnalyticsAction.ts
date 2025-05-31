import {
  generateAction,
  generateGetAction,
} from '@services/ActionDispatcher';

import {
  getFollowersAnalyticsAction,
  getViewersAnalyticsAction,
  getViewsAnalyticsAction,
  setChartViewAction,
} from './AnalyticsActionConfig';

// action request dispatchers
const setChartViewDispatch = (view: string) => generateAction(
  setChartViewAction, view,
);

const getViewsAnalyticsRequest = (queryParams: any) => generateGetAction(
  // action name
  getViewsAnalyticsAction,
  // url
  'analytics/views',
  { queryParams },
);

const getFollowersAnalyticsRequest = (queryParams: any) => generateGetAction(
  // action name
  getFollowersAnalyticsAction,
  // url
  'analytics/followers',
  { queryParams },
);

const getViewersAnalyticsRequest = (queryParams: any) => generateGetAction(
  // action name
  getViewersAnalyticsAction,
  // url
  'analytics/viewers',
  { queryParams },
);

// register actions here
export {
  // normal dispatch
  setChartViewDispatch,

  // async (request) dispatch
  // eslint-disable-next-line import/prefer-default-export
  getViewsAnalyticsRequest,
  getFollowersAnalyticsRequest,
  getViewersAnalyticsRequest,
};
