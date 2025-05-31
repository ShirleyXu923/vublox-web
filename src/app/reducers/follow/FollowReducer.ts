import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

const defaultState = {};

type State = typeof defaultState;

const reducer = handleActions<State, AnyAction>({}, defaultState);

export default reducer;
