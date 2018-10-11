import {
  CHANGE_SOURCE,
  SAVE_SCRIPT_STARTED,
  SAVE_SCRIPT_COMPLETED,
  LOAD_SCRIPT_STARTED,
  LOAD_SCRIPT_COMPLETED,
} from './action-types';

import localstorage from '../localstorage';

export function changeSource(source, cursor) {
  return action(CHANGE_SOURCE, {
    source,
    cursor
  });
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

export function loadScript() {
  return function loadScriptThunk(dispatch) {
    dispatch(loadScriptStarted());

    localstorage.get('comic-writer.script')
      .then(source => dispatch(loadScriptCompleted(source)));
  };
}

function loadScriptStarted() {
  return action(LOAD_SCRIPT_STARTED);
}

function loadScriptCompleted(source) {
  return action(LOAD_SCRIPT_COMPLETED, {source});
}


function action(type, payload = {}) {
  return {
    type,
    payload
  };
}