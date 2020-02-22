import { ThunkAction } from 'redux-thunk';
import { EditorState, EditorActionTypes } from '../editor/types';

/**
 * Defines the state shape of the whole store.
 */
export interface RootState {
  editor: EditorState
}

export type AppActionTypes = EditorActionTypes;

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
  AppActionTypes
>
