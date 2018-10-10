import { parse } from '../../custom-markdown';
import extractStats from './extract-stats';

import {
  CHANGE_SOURCE
} from '../action-types';
import editorReducer from './editor';

export default function rootReducer(state, action) {
  state = state || {
    parseTree: [],
    statsById: {}
  };

  let parseTree = state.parseTree;
  let statsById = state.statsById;

  if (action.type === CHANGE_SOURCE) {
    parseTree = parse(action.payload.source);
    statsById = extractStats(parseTree);
  }

  return {
    editor: editorReducer(state.editor, action),
    parseTree,
    statsById
  };
}