import { EditorConfiguration, Mode } from 'codemirror';
import { State } from './state';
import token from './token';

export default function create(config: EditorConfiguration): Mode<State> {
  return {
    startState() {
      return new State();
    },
    copyState(state: State) {
      return state.copy();
    },
    indent: () => 0,
    token
  };
}
