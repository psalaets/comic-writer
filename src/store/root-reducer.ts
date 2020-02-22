import { combineReducers } from 'redux';
import { reducer as editorReducer } from '../editor';
import { reducer as scriptReducer } from '../script';

export default combineReducers({
  editor: editorReducer,
  script: scriptReducer
});
