import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import { EditorChangeEvent, EditorScrollEvent } from '../types';

import { useStore } from '../../store/use-store';
import CodeMirror from './codemirror/CodeMirror';

export const Editor: React.FC = observer(() => {
  const {
    script: scriptStore,
    editor: editorStore
  } = useStore();

  const onChange = useCallback((event: EditorChangeEvent) => {
    scriptStore.updateScript(event.lines);
  }, [scriptStore]);

  const onScroll = useCallback((event: EditorScrollEvent) => {
    editorStore.updateScroll(event);
  }, [editorStore]);

  return (
    <CodeMirror
      value={scriptStore.initialValue}
      targetLine={editorStore.targetLine}
      panelCounts={scriptStore.panelCounts}
      wordCounts={scriptStore.wordCounts}
      characters={scriptStore.speakers}
      onChange={onChange}
      onScroll={onScroll}
    />
  );
});
