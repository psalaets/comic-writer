import CodeMirror from 'codemirror';
import { Selection } from '../types';
import { wrapSelection } from '../helpers';

const STAR_STAR = '**';

/**
 * CodeMirror command that toggles text in comic lettering to/from bold. No
 * matter what the user's text selection is, this tries to do the Right Thing.
 *
 * @param cm CodeMirror Editor
 */
export function letteringBoldCommand(cm: CodeMirror.Editor) {
  const selection = normalizeSelection(cm.listSelections()[0]);
  const lineNumber = cm.getCursor().line;

  const originalContent = cm.getLine(lineNumber);
  const newContent = wrapSelection(
    originalContent,
    selection.anchor.ch,
    selection.head.ch,
    STAR_STAR,
    STAR_STAR
  );

  cm.operation(() => {
    cm.replaceRange(newContent, {
      ch: 0,
      line: lineNumber
    }, {
      ch: originalContent.length,
      line: lineNumber
    });

    cm.setSelection({
      ch: selection.anchor.ch + STAR_STAR.length,
      line: lineNumber
    }, {
      ch: selection.head.ch + STAR_STAR.length,
      line: lineNumber
    });
  });
}

// returns Selection where anchor is never to the right of head
function normalizeSelection(selection: Selection): Selection {
  const { anchor, head } = selection;

  // on different lines
  if (anchor.line < head.line) {
    return {
      anchor: anchor,
      head: head
    };
  } else if (head.line < anchor.line) {
    return {
      anchor: head,
      head: anchor
    };
  }

  // on same line
  if (anchor.ch < head.ch) {
    return {
      anchor: anchor,
      head: head
    };
  } else if (head.ch < anchor.ch) {
    return {
      anchor: head,
      head: anchor
    };
  }

  // at same exact spot
  return {
    anchor: anchor,
    head: head
  };
}
