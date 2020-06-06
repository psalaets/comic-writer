import React from 'react';
import { OutlineItem } from '../../types';

interface PanelListProps {
  panels: Array<OutlineItem>;
}

export const PanelList: React.FC<PanelListProps> = props => {
  const panelItems = props.panels.map(panel => {
    return (
      <PanelItem
        key={panel.id}
        label={panel.label}
        current={panel.current}
      />
    );
  });

  return (
    <ol>
      {panelItems}
    </ol>
  );
};

interface PanelItemProps {
  label: string,
  current: boolean;
}

export const PanelItem: React.FC<PanelItemProps> = props => {
    return (
    <li>
      {props.label}
      {props.current ? ' <' : null}
    </li>
  );
};
