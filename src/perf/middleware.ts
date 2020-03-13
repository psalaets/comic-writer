import { MiddlewareAPI } from 'redux';
import { RootState, AppActionTypes, ThunkCompatibleDispatch, ThunkResult } from '../store/types';

import { start, end } from './measure';

export function timer(api: MiddlewareAPI<ThunkCompatibleDispatch, RootState>) {
  return function (next: ThunkCompatibleDispatch) {
    return function (action: AppActionTypes) {
      const name = getName(action);
      start(name);

      next(action);

      end(name);
    };
  };
}

function getName(action: AppActionTypes | ThunkResult): string {
  if (isThunk(action)) {
    return action.name;
  } else {
    return action.type;
  }
}

function isThunk(action: AppActionTypes | ThunkResult): action is ThunkResult {
  return typeof action === 'function';
}
