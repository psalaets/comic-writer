import {
  CHANGE_SOURCE
} from '../../action-types';

export default function sourceReducer(state = '', action) {
  switch (action.type) {
    case CHANGE_SOURCE:
      return action.payload.source;
    default:
      return state;
  }
}