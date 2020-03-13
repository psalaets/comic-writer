import {
  CHANGE_SOURCE,
  LOAD_SCRIPT_COMPLETED,
  ScriptActionTypes,
  ScriptState
} from './types';
import { wrap } from '../perf';

const initialState: ScriptState = {
  source: ''
};

function reducer(state = initialState, action: ScriptActionTypes): ScriptState {
  switch (action.type) {
    case LOAD_SCRIPT_COMPLETED: {
      return {
        source: action.payload.source
      };
    }
    case CHANGE_SOURCE: {
      return {
        source: action.payload.source
      };
    }
    default:
      return state;
  }
}

export default wrap('script-reducer', reducer);
