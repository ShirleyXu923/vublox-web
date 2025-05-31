import {
  generateAction,
  generateGetAction,
  generatePostAction,
} from '@services/ActionDispatcher';

import {
  createCategoryAction,
  getCategoriesAction,
  setAdvancedFiltersAction,
  setSelectedFiltersAction,
} from './CategoryActionConfig';

// action request dispatchers
const setSelectedFiltersDispatch = (filters: any) => generateAction(
  setSelectedFiltersAction,
  filters,
);

const setAdvancedFiltersDispatch = (filters: any) => generateAction(
  setAdvancedFiltersAction,
  filters,
);

const getCategoriesRequest = (queryParams: any) => generateGetAction(
  // action name
  getCategoriesAction,
  // url
  'categories',
  { queryParams },
);

const createCategoryRequest = (data: any) => generatePostAction(
  // action name
  createCategoryAction,
  // url
  'categories',
  // data
  data,
);

// register actions here
export {
  // normal dispatch
  setSelectedFiltersDispatch,
  setAdvancedFiltersDispatch,

  // async (request) dispatch
  getCategoriesRequest,
  createCategoryRequest,
};
