import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

import { dontShowAdultTooltipAction, setThemeAction, setTimelineSizeAction } from './AppActionConfig';

// reducers
const defaultState = {
  theme: 'dark',
  showAdultTooltip: true,
  timeline: {
    left: '58.33%',
    right: '41.67%',
  },
};

type State = typeof defaultState;

const reducer = handleActions<State, AnyAction>({
  [`${setThemeAction}`](state, { payload }: AnyAction) {
    return {
      ...state,
      theme: payload,
    };
  },
  [`${dontShowAdultTooltipAction}`](state, { payload }: AnyAction) {
    return {
      ...state,
      showAdultTooltip: payload,
    };
  },
  [`${setTimelineSizeAction}`](state, { payload }: AnyAction) {
    return {
      ...state,
      timeline: payload,
    };
  },
}, defaultState);

export default reducer;
