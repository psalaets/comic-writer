import React, { useCallback, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store/use-store';
import {
  SpreadOutlineItem,
  PanelOutlineItem,
  OutlineItemSelectionEvent,
  CenteringRequestEvent
} from '../../types';

import { SpreadItem } from './SpreadItem';
import { PanelItem } from './PanelItem';

import './Outline.css';

interface Props {
  items: Array<SpreadOutlineItem | PanelOutlineItem>;
  top: SpreadOutlineItem;
  onSelection: (event: OutlineItemSelectionEvent) => void;
}

export const Outline: React.FC<Props> = props => {
  const navRef = useRef<HTMLElement>(null);

  const handleCenteringRequest = useCallback((event: CenteringRequestEvent) => {
    const elementBounds = event.element.getBoundingClientRect();
    const elementCenter = elementBounds.top + (elementBounds.height / 2);

    const nav = navRef.current!;

    const outlineBounds = nav.getBoundingClientRect();
    const outlineCenter = outlineBounds.top + (outlineBounds.height / 2);

    nav.scrollBy({
      top: elementCenter - outlineCenter
    });
  }, [navRef]);

  return (
    <nav
      ref={navRef}
      className={`
        c-outline
        ${false ? 'c-outline--scroll-snap' : ''}
      `}
    >
      <ol>
        <SpreadItem
          key={props.top.id}
          id={props.top.id}
          lineNumber={props.top.lineNumber}
          current={props.top.current}
          label={props.top.label}
          onSelection={props.onSelection}
          onCenteringRequest={handleCenteringRequest}
        />
        {
          props.items.map(item => {
            if (item.type === 'panel') {
              return (
                <PanelItem
                  key={item.id}
                  id={item.id}
                  lineNumber={item.lineNumber}
                  current={item.current}
                  description={item.description}
                  panelNumber={item.panelNumber}
                  onSelection={props.onSelection}
                  onCenteringRequest={handleCenteringRequest}
                />
              );
            } else {
              return (
                <SpreadItem
                  key={item.id}
                  id={item.id}
                  lineNumber={item.lineNumber}
                  current={item.current}
                  label={item.label}
                  onSelection={props.onSelection}
                  onCenteringRequest={handleCenteringRequest}
                />
              );
            }
          })
        }
      </ol>
    </nav>
  );
};

export const WiredOutline: React.FC = observer(() => {
  const { editor } = useStore();

  const onSelection = useCallback((event: OutlineItemSelectionEvent) => {
    editor.selectOutlineItem(event.lineNumber);
  }, [editor]);

  return (
    <Outline
      items={editor.outlineItems}
      top={editor.topOutlineItem}
      onSelection={onSelection}
    />
  );
});
