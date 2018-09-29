import { parse } from '../../custom-markdown';
import extractStats from './extract-stats';
import {
  CHANGE_SOURCE
} from '../action-types';

export default function rootReducer(state, action) {
  state = state || {
    source: '',
    parseTree: []
  };

  switch (action.type) {
    case CHANGE_SOURCE:
      const parseTree = parse(action.payload.source);
      const stats = extractStats(parseTree);

      return {
        ...state,
        source: action.payload.source,
        parseTree,
        statsById: stats,
      };
    default:
      return state;
  }
};