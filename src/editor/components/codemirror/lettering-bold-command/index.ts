import CodeMirror from 'codemirror';

interface Selection {
  anchor: CodeMirror.Position,
  head: CodeMirror.Position
}

/**
 * CodeMirror command that toggles text in comic lettering to/from bold. No
 * matter what the user's text selection is, this tries to do the Right Thing.
 *
 * @param cm CodeMirror Editor
 */
export function letteringBoldCommand(cm: CodeMirror.Editor) {
  const selection = normalizeSelection(cm.listSelections()[0]);
  wrapSelection(cm, selection, '**', '**');
}

function wrapSelection(
  cm: CodeMirror.Editor,
  selection: Selection,
  front: string,
  back: string
): void {
  const lineNumber = selection.anchor.line;
  const originalContent = cm.getLine(lineNumber);

  const beforeSelected = originalContent.slice(0, selection.anchor.ch);
  const selected       = originalContent.slice(selection.anchor.ch, selection.head.ch);
  const afterSelected  = originalContent.slice(selection.head.ch);

  const newContent = [
    beforeSelected,
    front,
    selected,
    back,
    afterSelected
  ].join('');

  cm.operation(() => {
    cm.replaceRange(newContent, {
      ch: 0,
      line: lineNumber
    }, {
      ch: originalContent.length,
      line: lineNumber
    });

    cm.setSelection({
      ch: selection.anchor.ch + front.length,
      line: lineNumber
    }, {
      ch: selection.head.ch + front.length,
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
