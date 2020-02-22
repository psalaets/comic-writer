import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { EditorState } from '../editor/types';
import { ScriptState, ScriptActionTypes } from '../script/types';
import { Action } from 'redux';

/**
 * Defines the state shape of the whole store.
 */
export interface RootState {
  editor: EditorState,
  script: ScriptState
}

/**
 * Every action type in the app.
 */
export type AppActionTypes = ScriptActionTypes;

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

/**
 * Helper type for the dispatch function passed to mapPropsToDispatch when
 * creating a react-redux connected component.
 *
 * Example usage:
 *
 * function mapDispatchToProps(dispatch: ThunkCompatibleDispatch) {
 *   return {
 *     onChange(event: SomeEvent) {
 *       dispatch(actions.blah(event.value));
 *     }
 *   };
 * }
 */
export type ThunkCompatibleDispatch = ThunkDispatch<RootState, undefined, Action>;
