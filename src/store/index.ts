import {
  ScriptStore,
  createStore as createScriptStore
} from '../script/script-store';

export interface RootStore {
  script: ScriptStore
}

export function create(): RootStore {
  return {
    script: createScriptStore()
  };
}
