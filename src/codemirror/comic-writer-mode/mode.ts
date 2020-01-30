import { EditorConfiguration, Mode } from 'codemirror';
import { ComicWriterModeState } from './types';
import token from './token';

export default function create(config: EditorConfiguration): Mode<ComicWriterModeState> {
  return {
    startState() {
      return {
        isInCaptionText: false,
        isInDialogueText: false,
        inLettering: false,
        subjectDone: false,
        allowsBoldInContent: false,
        modifierDone: false,
        inModifier: false,
        contentDone: false,
        inContent: false
      };
    },
    indent: () => 0,
    token
  };
}
