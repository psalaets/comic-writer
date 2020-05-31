import debounce from 'lodash/debounce';

import { ThunkResult, ThunkCompatibleDispatch } from '../store/types';
import {
  CHANGE_SOURCE,
  SAVE_SCRIPT_STARTED,
  SAVE_SCRIPT_COMPLETED,
  LOAD_SCRIPT_STARTED,
  LOAD_SCRIPT_COMPLETED,
  ScriptActionTypes,
} from './types';

import localstorage from '../localstorage';

const debouncedSaveScript = debounce((lines: Array<string>, dispatch: ThunkCompatibleDispatch) => {
  dispatch(saveScript(lines.join('\n')));
}, 1000);

export function changeSource(lines: Array<string>): ThunkResult {
  return function changeSourceThunk(dispatch, getState) {
    dispatch(changeSourceInternal(lines));
    debouncedSaveScript(lines, dispatch);
  };
}

function changeSourceInternal(lines: Array<string>): ScriptActionTypes {
  return {
    type: CHANGE_SOURCE,
    payload: {
      lines
    }
  };
}

function saveScript(source: string): ThunkResult {
  return function saveScriptThunk(dispatch) {
    dispatch(saveScriptStarted());

    localstorage.set('comic-writer.script', source)
      .then(() => {
        dispatch(saveScriptCompleted())
        console.log('save script completed');
      });
  };
}

function saveScriptStarted(): ScriptActionTypes {
  return {
    type: SAVE_SCRIPT_STARTED
  };
}

function saveScriptCompleted(): ScriptActionTypes {
  return {
    type: SAVE_SCRIPT_COMPLETED
  };
}

export function loadScript(): ThunkResult {
  return function loadScriptThunk(dispatch) {
    dispatch(loadScriptStarted());

    localstorage.get<string>('comic-writer.script')
      // If local storage is null/empty on given key, then do nothing. Otherwise
      // dispatch loadScriptCompleted. I expect this check to be removed once we
      // have n number of scripts. Perhaps a dispatch of an error state?
      .then(source => source === null ? false : dispatch(loadScriptCompleted(source)));
  };
}

function loadScriptStarted(): ScriptActionTypes {
  return {
    type: LOAD_SCRIPT_STARTED
  };
}

function loadScriptCompleted(source: string): ScriptActionTypes {
  return {
    type: LOAD_SCRIPT_COMPLETED,
    payload: {
      source
    }
  };
}
