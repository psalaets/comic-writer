import editorReducer from './editor';

export default function rootReducer(state = {}, action) {
  return {
    editor: editorReducer(state.editor, action)
  };
}