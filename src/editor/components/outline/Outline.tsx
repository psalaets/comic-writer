import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store/use-store';
import { SpreadList } from './SpreadList';
import { SpreadOutlineItem } from '../../types';

interface Props {
  spreads: Array<SpreadOutlineItem>;
}

export const Outline: React.FC<Props> = props => {
  return (
    <nav className="c-outline">
      <SpreadList spreads={props.spreads} />
    </nav>
  );
};

export const WiredOutline: React.FC = observer(() => {
  const { editor } = useStore();

  return (
    <Outline
      spreads={editor.outlineItems}
    />
  );
});
