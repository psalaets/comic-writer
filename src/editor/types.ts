// action type strings
export const CHANGE_SOURCE = 'CHANGE_SOURCE';

export const SAVE_SCRIPT_STARTED = 'SAVE_SCRIPT_STARTED';
export const SAVE_SCRIPT_COMPLETED = 'SAVE_SCRIPT_COMPLETED';
export const SAVE_SCRIPT_ERRORED = 'SAVE_SCRIPT_ERRORED';

export const LOAD_SCRIPT_STARTED = 'LOAD_SCRIPT_STARTED';
export const LOAD_SCRIPT_COMPLETED = 'LOAD_SCRIPT_COMPLETED';
export const LOAD_SCRIPT_ERRORED = 'LOAD_SCRIPT_ERRORED';

// action object shapes

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

// state shape

export interface EditorState {
  source: string
}

// component related

export interface EditorChangeEvent {
  value: string;
}

// stats related

export interface PanelCount {
  count: number,
  lineNumber: number
}

export interface WordCount {
  count: number,
  lineNumber: number,
  isSpread: boolean
}
