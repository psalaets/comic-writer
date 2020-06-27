import React, { useEffect, useRef } from 'react';
import { PanelOutlineItem, OutlineItemSelectionEvent, CenteringRequestEvent } from '../../types';
import { useNeedsScrollCallback } from './use-intersection-observer';

interface PanelListProps {
  panels: Array<PanelOutlineItem>;
  onSelection: (event: OutlineItemSelectionEvent) => void;
  onCenteringRequest: (event: CenteringRequestEvent) => void;
}

export const PanelList: React.FC<PanelListProps> = props => {
  const panelItems = props.panels.map(panel => {
    return (
      <PanelItem
        key={panel.id}
        panel={panel}
        onSelection={props.onSelection}
        onCenteringRequest={props.onCenteringRequest}
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
  onCenteringRequest: (event: CenteringRequestEvent) => void;
}

export const PanelItem: React.FC<PanelItemProps> = props => {
  const {panel, onCenteringRequest} = props;

  const onClick = (event: React.MouseEvent) => {
    props.onSelection({item: props.panel});
    event.stopPropagation();
  };

  const needsScroll = useRef(false);

  const ref = useNeedsScrollCallback<HTMLLIElement>(
    needs => needsScroll.current = needs
  );

  useEffect(() => {
    if (panel.current && needsScroll.current) {
      onCenteringRequest({
        element: ref.current!
      });
    }
  }, [panel, onCenteringRequest, ref]);

  return (
    <li
      ref={ref}
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
