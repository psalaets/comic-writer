import { ThunkAction } from 'redux-thunk';

export const CHANGE_SOURCE = 'CHANGE_SOURCE';

export const SAVE_SCRIPT_STARTED = 'SAVE_SCRIPT_STARTED';
export const SAVE_SCRIPT_COMPLETED = 'SAVE_SCRIPT_COMPLETED';
export const SAVE_SCRIPT_ERRORED = 'SAVE_SCRIPT_ERRORED';

export const LOAD_SCRIPT_STARTED = 'LOAD_SCRIPT_STARTED';
export const LOAD_SCRIPT_COMPLETED = 'LOAD_SCRIPT_COMPLETED';
export const LOAD_SCRIPT_ERRORED = 'LOAD_SCRIPT_ERRORED';

interface ChangeSourceAction {
  type: typeof CHANGE_SOURCE,
  payload: {
    source: string
  }
}

interface SaveScriptStartedAction {
  type: typeof SAVE_SCRIPT_STARTED
}

interface SaveScriptCompletedAction {
  type: typeof SAVE_SCRIPT_COMPLETED
}

interface SaveScriptErroredAction {
  type: typeof SAVE_SCRIPT_ERRORED
}

interface LoadScriptStartedAction {
  type: typeof LOAD_SCRIPT_STARTED
}

interface LoadScriptCompletedAction {
  type: typeof LOAD_SCRIPT_COMPLETED,
  payload: {
    source: string
  }
}

interface LoadScriptErroredAction {
  type: typeof LOAD_SCRIPT_ERRORED
}

export type EditorActionTypes = ChangeSourceAction
  | SaveScriptStartedAction
  | SaveScriptCompletedAction
  | SaveScriptErroredAction
  | LoadScriptStartedAction
  | LoadScriptCompletedAction
  | LoadScriptErroredAction;

export interface EditorState {
  source: string
}

/**
 * Defines the state shape of the whole store.
 */
export interface RootState {
  editor: EditorState
}

/**
 * Helper type for using redux-thunk in our app.
 *
 * Every action creator that returns a thunk (as opposed to actions that are
 * just regular objects) should have this as their return type.
 */
export type ThunkResult<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined,
  EditorActionTypes
>
