import './configure-mobx';
import { computed } from 'mobx';
import { createStore as createScriptStore, ScriptStore } from '../script';
import { createStore as createEditorStore, EditorStore } from '../editor';

export interface RootStore {
  script: ScriptStore;
  editor: EditorStore;
}

export function createStore(): RootStore {
  const scriptStore = createScriptStore();

  return {
    script: scriptStore,
    editor: createEditorStore(scriptStore),
  };
}
