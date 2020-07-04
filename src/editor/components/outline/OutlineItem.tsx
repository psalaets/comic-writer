import React, { useRef, useEffect } from 'react';
import { OutlineItemSelectionEvent, CenteringRequestEvent } from '../../types';
import { useNeedsScrollCallback } from './use-intersection-observer';

import './OutlineItem.css'

interface Props {
  id: string;
  /** Zero-based line number that this item corresponds to */
  lineNumber: number;
  /** Is this item the "current" item in the editor? */
  current: boolean;
  /** The content of this item */
  children: React.ReactNode;
  onSelection: (event: OutlineItemSelectionEvent) => void;
  onCenteringRequest: (event: CenteringRequestEvent) => void;
}

export const OutlineItem: React.FC<Props> = props => {
  const { current, onCenteringRequest } = props;

  const onClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    props.onSelection({ lineNumber: props.lineNumber });
  };

  const needsScroll = useRef(false);
  const ref = useNeedsScrollCallback<HTMLLIElement>(
    needs => needsScroll.current = needs
  );

  useEffect(() => {
    if (current && needsScroll.current) {
      onCenteringRequest({
        element: ref.current!
      });
    }
  }, [current, onCenteringRequest, ref]);

  return (
    <li
      onClick={onClick}
      ref={ref}
      className={`
        c-outline-item
        ${current ? 'c-outline-item--current' : ''}
      `}
    >
      {props.children}
    </li>
  );
}
