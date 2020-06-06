import React from 'react';
import { PanelList } from './PanelList';
import { SpreadOutlineItem, OutlineItemSelectionEvent } from '../../types';

interface SpreadListProps {
  spreads: Array<SpreadOutlineItem>;
  onSelection: (event: OutlineItemSelectionEvent) => void;
}

export const SpreadList: React.FC<SpreadListProps> = props => {
  const spreadItems = props.spreads.map(spread => {
    return (
      <SpreadItem
        key={spread.id}
        spread={spread}
        onSelection={props.onSelection}
      />
    );
  });

  return (
    <ol>
      {spreadItems}
    </ol>
  );
};

interface SpreadItemProps {
  spread: SpreadOutlineItem;
  onSelection: (event: OutlineItemSelectionEvent) => void;
}

export const SpreadItem: React.FC<SpreadItemProps> = props => {
  const panelList = props.spread.panels.length > 0
    ? <PanelList panels={props.spread.panels} onSelection={props.onSelection} />
    : null;

  return (
    <li onClick={() => props.onSelection({item: props.spread})}>
      {props.spread.label}
      {props.spread.current ? ' <' : null}
      {panelList}
    </li>
  );
};
