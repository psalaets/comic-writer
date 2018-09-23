import { parse } from '../../custom-markdown';
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
      return {
        ...state,
        source: action.payload.source,
        parseTree: parse(action.payload.source)
      };
    default:
      return state;
  }
};