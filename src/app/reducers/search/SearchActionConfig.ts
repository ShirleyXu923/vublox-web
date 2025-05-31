/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

export const systemWideSearchAction = createAction('VUBLOX_SEARCH_SYSTEM_WIDE_SEARCH');
export const setKeywordAction = createAction('VUBLOX_SEARCH_SET_KEYWORD');
export const clearKeywordAction = createAction('VUBLOX_SEARCH_CLEAR_KEYWORD');
export const searchWorldViewAction = createAction('VUBLOX_SEARCH_WORLD_VIEW');
export const clearSearchResultsAction = createAction('VUBLOX_CLEAR_SEARCH_RESULTS');
