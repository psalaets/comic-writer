import { createStore, applyMiddleware } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import debounce from 'lodash/debounce';
import { saveScript } from './actions';

import { rootReducer } from './reducers';
import sourceSelector from './selectors/source';
import { RootState, EditorActionTypes } from './types';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware<RootState, EditorActionTypes>)
);

saveSourceOnChange(store);

export default store;

type StoreType = typeof store;

function saveSourceOnChange(store: StoreType) {
  const debouncedSaveScript = debounce((source: string) => {
    store.dispatch(saveScript(source));
  }, 1000);

  const NOT_SET_YET = null;
  let oldSource = NOT_SET_YET;

  store.subscribe(() => {
    const newSource = sourceSelector(store.getState());

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
