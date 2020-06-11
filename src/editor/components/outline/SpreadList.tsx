import React, { useEffect, useRef } from 'react';
import { PanelList } from './PanelList';
import { SpreadOutlineItem, OutlineItemSelectionEvent } from '../../types';
import { useNeedsScrollCallback } from './use-intersection-observer';

interface SpreadListProps {
  spreads: Array<SpreadOutlineItem>;
  onSelection: (event: OutlineItemSelectionEvent) => void;
}

export const SpreadList: React.FC<SpreadListProps> = props => {
  const spreadItems = props.spreads.map(spread =>
      <SpreadItem key={spread.id}
        spread={spread}
        onSelection={props.onSelection}
      />);

  return (
    <ol className="c-outline__spread-list">
      {spreadItems}
    </ol>
  );
};

interface SpreadItemProps {
  spread: SpreadOutlineItem;
  onSelection: (event: OutlineItemSelectionEvent) => void;
}

export const SpreadItem: React.FC<SpreadItemProps> = props => {
  const panelList = props.spread.panels.length > 0 &&
    <PanelList
      panels={props.spread.panels}
      onSelection={props.onSelection}/>

  const needsScroll = useRef(false);

  const divRef = useNeedsScrollCallback<HTMLDivElement>(
    needs => needsScroll.current = needs
  );

  useEffect(() => {
    if (props.spread.current && needsScroll.current) {
      divRef.current!.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      });
    }
  }, [props.spread, divRef]);

  return (
    <li
      onClick={() => props.onSelection({item: props.spread})}
    >
      <div
        className={`
          c-outline__spread-list-item
          ${props.spread.current ? 'c-outline__spread-item--current' : ''}
        `}
        ref={divRef}
      >
        {props.spread.label}
      </div>
      {panelList}
    </li>
  );
};
