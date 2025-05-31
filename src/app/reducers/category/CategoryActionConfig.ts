/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

// Action Declarations
// Suggested Action Name Standard: ORG_MODULE_ACTION_ANY
export const getCategoriesAction = createAction('VUBLOX_CATEGORY_GET_CATEGORIES');
export const createCategoryAction = createAction('VUBLOX_CATEGORY_CREATE_CATEGORY');
export const setSelectedFiltersAction = createAction('VUBLOX_CATEGORY_SET_SELECTED_FILTERS');
export const setAdvancedFiltersAction = createAction('VUBLOX_CATEGORY_SET_ADVANCED_FILTERS');
