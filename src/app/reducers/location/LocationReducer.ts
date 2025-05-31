import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

import { getLocationAction, getLocationsAction } from './LocationActionConfig';

// reducers
const defaultState = {
  list: [],
  location: {
    id: '',
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    followers_count: 0,
    posts_count: 0,
    is_following: false,
    slug: '',
    timeblockables: {},
  },
};

type State = typeof defaultState;

const reducer = handleActions<State, AnyAction>({
  [`${getLocationsAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      list: payload.meta?.currentPage === 1 ? payload.items : state.list,
    };
  },
  [`${getLocationAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      location: payload,
    };
  },
}, defaultState);

export default reducer;
