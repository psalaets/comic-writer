import React from 'react';
import { PanelList } from './PanelList';
import { SpreadOutlineItem } from '../../types';

interface SpreadListProps {
  spreads: Array<SpreadOutlineItem>;
}

export const SpreadList: React.FC<SpreadListProps> = props => {
  const spreadItems = props.spreads.map(spread => {
    return (
      <SpreadItem
        key={spread.id}
        spread={spread}
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
}

export const SpreadItem: React.FC<SpreadItemProps> = props => {
  const panelList = props.spread.panels.length > 0
    ? <PanelList panels={props.spread.panels} />
    : null;

  return (
    <li>
      {props.spread.label}
      {props.spread.current ? ' <' : null}
      {panelList}
    </li>
  );
};
