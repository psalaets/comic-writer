import React, { useEffect, useRef } from 'react';
import { PanelOutlineItem, OutlineItemSelectionEvent } from '../../types';

interface PanelListProps {
  panels: Array<PanelOutlineItem>;
  onSelection: (event: OutlineItemSelectionEvent) => void;
}

export const PanelList: React.FC<PanelListProps> = props => {
  const panelItems = props.panels.map(panel => {
    return (
      <PanelItem
        key={panel.id}
        panel={panel}
        onSelection={props.onSelection}
      />
    );
  });

  return (
    <ol className="c-outline__panel-list">
      {panelItems}
    </ol>
  );
};

interface PanelItemProps {
  panel: PanelOutlineItem;
  onSelection: (event: OutlineItemSelectionEvent) => void;
}

export const PanelItem: React.FC<PanelItemProps> = props => {
  const onClick = (event: React.MouseEvent) => {
    props.onSelection({item: props.panel});
    event.stopPropagation();
  };
  const panelItemRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    props.panel.current &&
    panelItemRef &&
    panelItemRef.current!.scrollIntoView({
      block: 'center',
      // behavior: 'smooth'
    })
  })


  return (
    <li
      ref={panelItemRef}
      onClick={onClick}
      className={`
        c-outline__panel-list-item
        ${props.panel.current ? 'c-outline__panel-list-item--current' : ''}
      `}
    >
      <span className="c-outline__panel-list-item-number">
        {props.panel.panelNumber}.
      </span>
      {props.panel.description || '(no description)'}
    </li>
  );
};
