import { AnyAction } from 'redux';
import { combineActions, handleActions } from 'redux-actions';

import {
  getEventAction, getEventStatisticsAction, getEventTimelineAction,
  getEventsAction, getMyEventsAction,
} from './EventActionConfig';

// reducers
const defaultState = {
  list: [],
  event: {
    id: '',
    name: '',
    description: '',
    is_following: false,
    created_by: '',
    ownerable_id: '',
    ownerable_type: '',
    banner_url: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
    },
    privacy_option: '',
    type: '',
    category: {
      id: '',
      name: '',
      parent: {
        name: '',
      },
    },
    started_at: new Date(),
    ended_at: null,
    co_creators: [],
    coCreators: [],
    tags: [],
    timeblockables: {},
    location: {
      id: '',
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      country_code: '',
    },
    timezone: '',
    game_mode: false,
  },
  events: {
    items: [],
    meta: {
      totalItems: 0,
    },
  },
};

type State = typeof defaultState;

const reducer = handleActions<State, AnyAction>({
  [`${getEventsAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      list: payload.meta?.currentPage === 1 ? payload.items : state.list,
    };
  },
  [`${getMyEventsAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      events: payload,
    };
  },
  [`${combineActions(getEventAction, getEventStatisticsAction)}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      event: payload,
    };
  },
  [`${getEventTimelineAction}`](state: State, { payload }: AnyAction) {
    if (state.event.id !== payload.id) {
      return {
        ...state,
      };
    }

    const event = payload;
    const { timeblockables } = event;

    const currentTimeblocks: any = state.event.timeblockables;

    Object.keys(timeblockables).map((key: string) => {
      if (currentTimeblocks[key]) {
        const current: any = currentTimeblocks[key];
        const timeblock: any = timeblockables[key];
        const last = current?.[current.length - 1];
        const first = timeblock?.[timeblock.length - 1];

        if (last.id !== first.id) {
          const mergedTimeblocks = [
            ...currentTimeblocks[key],
            ...timeblockables[key].filter(
              (tb: any) => !currentTimeblocks[key].some(
                (currentTimeblock: any) => {
                  if (currentTimeblock.type === 'PostGroup' && tb.type === 'PostGroup') {
                    return currentTimeblock.data.title === tb.data.title;
                  }

                  return currentTimeblock.id === tb.id;
                },
              ),
            ),
          ];

          currentTimeblocks[key] = mergedTimeblocks;
        }
      } else {
        currentTimeblocks[key] = [];
        currentTimeblocks[key] = [
          ...timeblockables[key],
        ];
      }
      return key;
    });

    event.timeblockables = currentTimeblocks;

    return {
      ...state,
      event,
    };
  },
}, defaultState);

export default reducer;
