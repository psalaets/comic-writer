import { EditorConfiguration, Mode } from 'codemirror';
import { ComicWriterModeState } from './types';
import token from './token';

export default function create(config: EditorConfiguration): Mode<ComicWriterModeState> {
  return {
    startState() {
      return {
        isInCaptionText: false,
        isInDialogueText: false
      };
    },
    indent: () => 0,
    token
  };
}
