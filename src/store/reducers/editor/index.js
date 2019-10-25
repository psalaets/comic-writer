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
        source: transformMarkdown(action.payload.source, 0)
      };
    }
    case CHANGE_SOURCE: {
      return {
        source: transformMarkdown(action.payload.source, action.payload.cursorLine)
      };
    }
    default:
      return state;
  }
}

// exported for testing purposes
export function transformMarkdown(value, cursorLine) {
  return value
    .split(/\n/)
    .map(classifyLines(cursorLine))
    .map(autoNumber())
    .join('\n');
}
