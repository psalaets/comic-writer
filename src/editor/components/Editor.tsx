import React, { useCallback } from 'react';
import { observer } from 'mobx-react';

import { EditorChangeEvent } from '../types';

import { useStore } from '../../store/use-store';
import CodeMirror from './codemirror/CodeMirror';

export const Editor: React.FC = observer(() => {
  const { script: scriptStore } = useStore();
  const onChange = useCallback((event: EditorChangeEvent) => {
    scriptStore.updateScript(event.lines);
  }, [scriptStore]);

  return (
    <CodeMirror
      editorWidth={80}
      value={scriptStore.source}
      panelCounts={scriptStore.panelCounts}
      wordCounts={scriptStore.wordCounts}
      characters={scriptStore.speakers}
      onChange={onChange}
    />
  );
});
