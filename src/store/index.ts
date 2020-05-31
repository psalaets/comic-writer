import { store as script } from '../script';

export interface RootStore {
  script: script.ScriptStore
}

export function create(): RootStore {
  return {
    script: script.createStore()
  };
}
