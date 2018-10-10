import {
  CHANGE_SOURCE,
  SAVE_SCRIPT_STARTED,
  SAVE_SCRIPT_COMPLETED,
} from './action-types';

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

    setTimeout(() => {
      console.log('saved');

      dispatch(saveScriptCompleted());
    }, 500);
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