import { combineReducers } from 'redux';
import { reducer as editorReducer } from '../editor';

export default combineReducers({
  editor: editorReducer
});
