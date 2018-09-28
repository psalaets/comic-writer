import {
  CHANGE_SOURCE
} from './action-types';

export function changeSource(source) {
  return {
    type: CHANGE_SOURCE,
    payload: {
      source
    }
  };
}