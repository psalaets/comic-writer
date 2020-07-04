import React from 'react';
import { OutlineItemSelectionEvent, CenteringRequestEvent } from '../../types';
import { OutlineItem } from './OutlineItem';

import './SpreadItem.css'

interface Props {
  id: string;
  lineNumber: number;
  current: boolean;
  label: string;
  onSelection: (event: OutlineItemSelectionEvent) => void;
  onCenteringRequest: (event: CenteringRequestEvent) => void;
}

export const SpreadItem: React.FC<Props> = React.memo(props => {
  return (
    <OutlineItem
      id={props.id}
      lineNumber={props.lineNumber}
      current={props.current}
      onSelection={props.onSelection}
      onCenteringRequest={props.onCenteringRequest}
    >
      <span className={`
        c-spread-item
        ${props.current ? 'c-spread-item--current' : ''}
      `}>
        {props.label}
      </span>
    </OutlineItem>
  );
});
