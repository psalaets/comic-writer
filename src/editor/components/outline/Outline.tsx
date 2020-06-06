import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store/use-store';
import { SpreadList } from './SpreadList';
import { SpreadOutlineItem, OutlineItemSelectionEvent } from '../../types';

interface Props {
  spreads: Array<SpreadOutlineItem>;
  onSelection: (event: OutlineItemSelectionEvent) => void;
}

export const Outline: React.FC<Props> = props => {
  return (
    <nav className="c-outline">
      <SpreadList
        spreads={props.spreads}
        onSelection={props.onSelection}
      />
    </nav>
  );
};

export const WiredOutline: React.FC = observer(() => {
  const { editor } = useStore();

  const onSelection = useCallback((event: OutlineItemSelectionEvent) => {
    editor.selectOutlineItem(event.item);
  }, [editor]);

  return (
    <Outline
      spreads={editor.outlineItems}
      onSelection={onSelection}
    />
  );
});
