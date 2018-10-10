import sourceReducer from './source';
import {
  CHANGE_SOURCE
} from '../../action-types';

export default function editorReducer(state = {}, action) {
  return {
    source: sourceReducer(state.source, action),
    cursor: cursorReducer(state.cursor, action)
  };
}

function cursorReducer(state = 0, action) {
  switch (action.type) {
    case CHANGE_SOURCE:
      return action.payload.cursor;
    default:
      return state;
  }
}