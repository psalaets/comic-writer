import React from 'react';
import { LocatedSpread } from '../../../script/types';

interface Props {
  spread: LocatedSpread;
  current: boolean;
}

export const SpreadItem: React.FC<Props> = props => {
  return (
    <li>
      {props.spread.label}
      {props.current ? ' <' : null}
    </li>
  );
};
