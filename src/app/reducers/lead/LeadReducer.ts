import {
} from './LeadActionConfig';
import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

// reducers
const defaultState = {
};

type State = typeof defaultState;

const reducer = handleActions<State, AnyAction>({

}, defaultState);

export default reducer;
