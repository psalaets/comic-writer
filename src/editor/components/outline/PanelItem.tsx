import React from 'react';
import { OutlineItemSelectionEvent, CenteringRequestEvent } from '../../types';
import { OutlineItem } from './OutlineItem';

interface Props {
  id: string;
  lineNumber: number;
  current: boolean;
  panelNumber: number;
  description: string | null;
  onSelection: (event: OutlineItemSelectionEvent) => void;
  onCenteringRequest: (event: CenteringRequestEvent) => void;
}

export const PanelItem: React.FC<Props> = React.memo(props => {
  return (
    <OutlineItem
      id={props.id}
      lineNumber={props.lineNumber}
      current={props.current}
      onSelection={props.onSelection}
      onCenteringRequest={props.onCenteringRequest}
    >
      <span className="c-outline__panel-list-item-number">
        {props.panelNumber}.
      </span>
      {props.description || '(no description)'}
    </OutlineItem>
  );
});
