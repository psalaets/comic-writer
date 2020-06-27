import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store/use-store';
import { SpreadList } from './SpreadList';
import {
  SpreadOutlineItem,
  OutlineItemSelectionEvent,
  CenteringRequestEvent
} from '../../types';

import './Outline.css';

interface Props {
  spreads: Array<SpreadOutlineItem>;
  top: SpreadOutlineItem;
  onSelection: (event: OutlineItemSelectionEvent) => void;
}

export const Outline: React.FC<Props> = props => {
  const handleCenteringRequest = (event: CenteringRequestEvent) => {
    event.element.scrollIntoView({
      block: 'center',
      inline: 'center',
      behavior: 'smooth'
    })
  }

  return (
    <nav className={`
      c-outline
      ${false ? 'c-outline--scroll-snap' : ''}
    `}>
      <SpreadList
        spreads={props.spreads}
        top={props.top}
        onSelection={props.onSelection}
        onCenteringRequest={handleCenteringRequest}
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
      top={editor.topOutlineItem}
      onSelection={onSelection}
    />
  );
});
