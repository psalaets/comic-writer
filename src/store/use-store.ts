import { useContext } from 'react';
import { RootStoreContext } from './root-store-context';
import { RootStore } from './';

export function useStore(): RootStore {
  const store = useContext(RootStoreContext);

  if (store == null) {
    throw new Error('store not available');
  } else {
    return store;
  }
}
