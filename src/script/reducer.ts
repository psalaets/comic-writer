import {
  CHANGE_SOURCE,
  LOAD_SCRIPT_COMPLETED,
  ScriptActionTypes,
  ScriptState
} from './types';

const initialState: ScriptState = {
  source: ''
};

export default reducer;

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
