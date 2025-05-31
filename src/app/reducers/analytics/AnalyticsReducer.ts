import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

import { setChartViewAction } from './AnalyticsActionConfig';

// reducers
const defaultState = {
  view: 'number',
};

type State = typeof defaultState;

const reducer = handleActions<State, AnyAction>({
  [`${setChartViewAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      view: payload,
    };
  },
}, defaultState);

export default reducer;
