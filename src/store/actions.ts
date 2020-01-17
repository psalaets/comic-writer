import {
  CHANGE_SOURCE,
  SAVE_SCRIPT_STARTED,
  SAVE_SCRIPT_COMPLETED,
  LOAD_SCRIPT_STARTED,
  LOAD_SCRIPT_COMPLETED,
  EditorActionTypes,
  ThunkResult
} from './types';

import localstorage from '../localstorage';

export function changeSource(source: string): EditorActionTypes {
  return {
    type: CHANGE_SOURCE,
    payload: {
      source
    }
  };
}

export function saveScript(source: string): ThunkResult {
  return function saveScriptThunk(dispatch) {
    dispatch(saveScriptStarted());

    localstorage.set('comic-writer.script', source)
      .then(() => dispatch(saveScriptCompleted()));
  };
}

function saveScriptStarted(): EditorActionTypes {
  return {
    type: SAVE_SCRIPT_STARTED
  };
}

function saveScriptCompleted(): EditorActionTypes {
  return {
    type: SAVE_SCRIPT_COMPLETED
  };
}

export function loadScript(): ThunkResult {
  return function loadScriptThunk(dispatch) {
    dispatch(loadScriptStarted());

    localstorage.get('comic-writer.script')
      // If local storage is null/empty on given key, then do nothing. Otherwise
      // dispatch loadScriptCompleted. I expect this check to be removed once we
      // have n number of scripts. Perhaps a dispatch of an error state?
      .then((source: string) => source === null ? false : dispatch(loadScriptCompleted(source)));
  };
}

function loadScriptStarted(): EditorActionTypes {
  return {
    type: LOAD_SCRIPT_STARTED
  };
}

function loadScriptCompleted(source: string): EditorActionTypes {
  return {
    type: LOAD_SCRIPT_COMPLETED,
    payload: {
      source
    }
  };
}
