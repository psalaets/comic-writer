import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store/use-store';
import { LocatedSpread } from '../../../script/types';
import { SpreadItem } from './SpreadItem';

interface Props {
  spreads: Array<LocatedSpread>;
  currentSpreadId: string | null,
  currentPanelId: string | null
}

export const Outline: React.FC<Props> = props => {

  const spreadItems = props.spreads.map(spread => {
    return (
      <SpreadItem
        key={spread.id}
        current={spread.id === props.currentSpreadId}
        spread={spread}
      />
    );
  });

  return (
    <ul>
      {spreadItems}
    </ul>
  );
}

export const WiredOutline: React.FC = observer(() => {
  const { script, editor } = useStore();

  return (
    <Outline
      spreads={script.locatedSpreads}
      currentSpreadId={editor.currentSpreadId}
      currentPanelId={editor.currentPanelId}
    />
  );
});
