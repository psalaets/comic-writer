import { createStore, applyMiddleware } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';

import rootReducer from './root-reducer';
import { RootState, AppActionTypes } from './types';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware<RootState, AppActionTypes>)
);

export default store;
