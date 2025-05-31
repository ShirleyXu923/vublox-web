import { xorBy } from 'lodash';
import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

import { getUserDetailsAction } from '@reducers/auth/AuthActionConfig';

import { getCategoriesAction, setAdvancedFiltersAction, setSelectedFiltersAction } from './CategoryActionConfig';

// reducers
const defaultState = {
  filters: [],
  selectedFilters: [],
  advancedFilters: {
    filters: {
      categories: [],
    },
    inverseFilters: {
      categories: [],
    },
  },
};

type State = typeof defaultState;

const reducer = handleActions<State, AnyAction>({
  [`${getCategoriesAction}`](state: any, { payload, params }: AnyAction) {
    const sportsCategories = payload.find((d: any) => d.name === 'Sports')?.subCategories || [];
    return {
      ...state,
      filters: params.keyword === 'sports' ? sportsCategories : state.filters,
      selectedFilters: sportsCategories,
    };
  },
  [`${getUserDetailsAction}`](state: any, { payload }: AnyAction) {
    return {
      ...state,
      selectedFilters: payload?.interests,
      advancedFilters: {
        filters: {
          categories: payload?.interests || [],
        },
        inverseFilters: {
          categories: xorBy(payload?.interests || [], state.filters,
            (c: any) => c.category_id ?? c.id),
        },
      },
    };
  },
  [`${setSelectedFiltersAction}`](state: any, { payload }: AnyAction) {
    return {
      ...state,
      selectedFilters: payload,
      advancedFilters: {
        filters: {
          categories: payload,
        },
        inverseFilters: {
          categories: xorBy(payload, state.filters,
            (c: any) => c.category_id ?? c.id),
        },
      },
    };
  },
  [`${setAdvancedFiltersAction}`](state: any, { payload }: AnyAction) {
    return {
      ...state,
      advancedFilters: payload,
    };
  },
}, defaultState);

export default reducer;
