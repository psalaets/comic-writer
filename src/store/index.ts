import { createStore, applyMiddleware } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import debounce from 'lodash/debounce';

import rootReducer from './root-reducer';
import { selectors, actions } from '../editor';
import { RootState, AppActionTypes } from './types';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware<RootState, AppActionTypes>)
);

saveSourceOnChange(store);

export default store;

type StoreType = typeof store;

function saveSourceOnChange(store: StoreType) {
  const debouncedSaveScript = debounce((source: string) => {
    store.dispatch(actions.saveScript(source));
  }, 1000);

  const NOT_SET_YET = '__NOT_SET__';
  let oldSource = NOT_SET_YET;

  store.subscribe(() => {
    const newSource = selectors.getSource(store.getState());

    if (oldSource === NOT_SET_YET) {
      if (newSource) {
        oldSource = newSource;
      }
    } else if (newSource !== oldSource) {
      oldSource = newSource;
      debouncedSaveScript(newSource);
    }
  });
}
