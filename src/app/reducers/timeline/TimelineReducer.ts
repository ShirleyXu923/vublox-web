import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

import {
  getTimelineTimeblockablesAction,
  getTimelineAction,
  getTimelinesAction,
  searchTimelineAction,
  getMyTimelinesAction,
  getTimeblockablesAction,
} from './TimelineActionConfig';

const defaultState = {
  timeline: null,
  searchResults: null,
  timeblockables: {
    root: {
      name: null,
      description: null,
      created_at: null,
    },
    timeline: [],
  },
  timelineTimeblockables: [],
  list: [],
  myTimelines: {
    items: [],
    meta: {
      currentPage: 0,
      totalPages: 0,
      links: [],
      totalItems: 0,
    },
  },
};

type State = typeof defaultState;

const reducer = handleActions<State, AnyAction>({
  [`${searchTimelineAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      searchResults: payload,
    };
  },

  [`${getTimelineAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      timeline: payload,
    };
  },
  [`${getMyTimelinesAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      myTimelines: payload,
    };
  },
  [`${getTimelineTimeblockablesAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      timeblockables: payload,
    };
  },
  [`${getTimelinesAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      list: payload.meta?.currentPage === 1 ? payload.items : state.list,
    };
  },
  [`${getTimeblockablesAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      timelineTimeblockables: payload,
    };
  },
}, defaultState);

export default reducer;
