import {
  CHANGE_SOURCE,
  SAVE_SCRIPT_STARTED,
  SAVE_SCRIPT_COMPLETED,
} from './action-types';

import localstorage from '../localstorage';

export function changeSource(source) {
  return action(CHANGE_SOURCE, {source});
}

export function saveScript(source) {
  return function saveScriptThunk(dispatch) {
    dispatch(saveScriptStarted());

    localstorage.set('comic-writer.script', source)
      .then(() => dispatch(saveScriptCompleted()));
  };
}

function saveScriptStarted() {
  return action(SAVE_SCRIPT_STARTED);
}

function saveScriptCompleted() {
  return action(SAVE_SCRIPT_COMPLETED);
}

function action(type, payload = {}) {
  return {
    type,
    payload
  };
}