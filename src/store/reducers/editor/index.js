import {
  CHANGE_SOURCE,
  LOAD_SCRIPT_COMPLETED
} from '../../action-types';

export default function editorReducer(state, action) {
  state = state || {
    source: ''
  };

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
