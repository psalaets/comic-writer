import {
  CHANGE_SOURCE,
  LOAD_SCRIPT_COMPLETED,
  EditorActionTypes,
  EditorState
} from '../../types';

const initialState: EditorState = {
  source: ''
};

export default function editorReducer(
  state = initialState,
  action: EditorActionTypes
): EditorState {
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
