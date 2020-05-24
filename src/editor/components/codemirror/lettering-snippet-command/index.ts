import CodeMirror, { Editor } from 'codemirror';
import { letteringSnippet } from './snippet';

export function create(getCharacterNames: () => Array<string>) {
  return function letteringSnippetCommand(cm: Editor): typeof CodeMirror.Pass | void {
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);

    // they hit tab on a blank line
    if (line === '') {
      letteringSnippet(cm, getCharacterNames);
    } else {
      return CodeMirror.Pass;
    }
  }
}
