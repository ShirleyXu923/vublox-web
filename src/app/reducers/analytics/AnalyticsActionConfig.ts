/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

// Action Declarations
// Suggested Action Name Standard: ORG_MODULE_ACTION_ANY
export const getViewsAnalyticsAction = createAction('APP_ANALYTICS_GET_VIEWS');
export const getFollowersAnalyticsAction = createAction('APP_ANALYTICS_GET_FOLLOWERS');
export const getViewersAnalyticsAction = createAction('APP_ANALYTICS_GET_VIEWERS');

export const setChartViewAction = createAction('APP_ANALYTICS_SET_CHART_VIEW');
