import React from 'react';
import { PanelList } from './PanelList';
import { SpreadOutlineItem, OutlineItemSelectionEvent } from '../../types';

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

  return (
    <li
      onClick={() => props.onSelection({item: props.spread})}
      className=""
    >
      <div className={`
        c-outline__spread-list-item
        ${props.spread.current ? 'c-outline__spread-item--current' : ''}
        `}
      >
        {props.spread.label}
      </div>
      {panelList}
    </li>
  );
};
