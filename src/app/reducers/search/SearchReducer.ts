import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

import { ImageType } from 'types';

import {
  clearKeywordAction, clearSearchResultsAction, setKeywordAction, systemWideSearchAction,
} from './SearchActionConfig';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  image?: ImageType | null;
  redirect: string;
}

type State = {
  keyword: string;
  results: {
    items: SearchItem[]
    meta: any
  }
};

const defaultState = {
  keyword: '',
  results: {
    items: [],
    meta: {},
  },
};

const reducer = handleActions<State, AnyAction>({
  [`${systemWideSearchAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      results: payload.meta.currentPage === 1 ? payload : {
        ...payload,
        items: [
          ...state.results.items,
          ...payload.items,
        ],
      },
    };
  },
  [`${setKeywordAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      keyword: payload,
    };
  },
  [`${clearKeywordAction}`](state: State) {
    return {
      ...state,
      keyword: '',
      results: defaultState.results,
    };
  },
  [`${clearSearchResultsAction}`](state: State) {
    return {
      ...state,
      results: defaultState.results,
    };
  },
}, defaultState);

export default reducer;
