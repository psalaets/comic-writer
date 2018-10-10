import {
  CHANGE_SOURCE,
  SAVE_SCRIPT_STARTED,
  SAVE_SCRIPT_COMPLETED,
} from './action-types';

import localstorage from '../localstorage';

export function changeSource(source) {
  return {
    type: CHANGE_SOURCE,
    payload: {
      source
    }
  };
}

export function saveScript(source) {
  return function saveScriptThunk(dispatch) {
    dispatch(saveScriptStarted());

    localstorage.set('comic-writer.script', source)
      .then(() => dispatch(saveScriptCompleted()));
  };
}

function saveScriptStarted() {
  return {
    type: SAVE_SCRIPT_STARTED,
    payload: {}
  };
}

function saveScriptCompleted() {
  return {
    type: SAVE_SCRIPT_COMPLETED,
    payload: {}
  };
}