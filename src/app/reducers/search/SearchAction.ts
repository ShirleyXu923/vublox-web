/* eslint-disable import/prefer-default-export */
import { generateAction, generateGetAction } from '@services/ActionDispatcher';

import {
  clearSearchResultsAction,
  searchWorldViewAction,
  setKeywordAction,
  systemWideSearchAction,
  clearKeywordAction,
} from './SearchActionConfig';

const systemWideSearchRequest = (queryParams: any) => generateGetAction(
  // action name
  systemWideSearchAction,
  // url
  'search',
  // data
  { queryParams },
);

const setKeywordRequest = (keyword: string) => generateAction(
  // action name
  setKeywordAction,
  keyword,
);

const clearKeywordRequest = () => generateAction(
  // action name
  clearKeywordAction,
);

const searchWorldViewRequest = (queryParams = {}) => generateGetAction(
  // action name
  searchWorldViewAction,
  // url
  'search/world',
  // data
  { queryParams },
);
const clearSearchResultsRequest = () => generateAction(
  // action name
  clearSearchResultsAction,
);

export {
  systemWideSearchRequest,
  setKeywordRequest,
  clearKeywordRequest,
  searchWorldViewRequest,
  clearSearchResultsRequest,
};
