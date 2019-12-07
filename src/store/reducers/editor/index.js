import {
  CHANGE_SOURCE,
  LOAD_SCRIPT_COMPLETED
} from '../../action-types';

import classifyLines from './classify-lines';
import autoNumber from './auto-number';

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
        source: preprocessSource(action.payload.source, action.payload.cursorLine)
      };
    }
    default:
      return state;
  }
}

// exported for testing purposes
export function preprocessSource(value, cursorLine) {
  return value
    .split(/\n/)
    .map(classifyLines(cursorLine))
    .map(autoNumber())
    .join('\n');
}
