import CodeMirror, { Token, Editor } from 'codemirror';
import { Selection } from '../types';
import { wrapSelection } from '../helpers';
import { LETTERING_CONTENT, PARAGRAPH, LETTERING_LINE } from '../mode/token';

const STAR_STAR = '**';

/**
 * CodeMirror command that toggles text in comic lettering to/from bold. No
 * matter what the user's text selection is, this tries to do the Right Thing.
 *
 * @param cm CodeMirror Editor
 */
export function letteringBoldCommand(cm: CodeMirror.Editor) {
  const selection = normalizeSelection(cm.listSelections()[0]);

  if (!selectionCanBeBolded(cm, selection)) {
    return;
  }

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

function selectionCanBeBolded(cm: Editor, selection: Selection): boolean {
  // Can't bold when there's a multi line selection
  if (selection.anchor.line !== selection.head.line) {
    return false;
  }

  const lineNumber = selection.anchor.line;
  const lineTokens = cm.getLineTokens(lineNumber);

  // just a cursor, no selection
  if (selection.anchor.ch === selection.head.ch) {
    const line = cm.getLine(lineNumber);
    const position = selection.anchor.ch;

    // can always bold on a blank line
    if (line === '') {
      return true;
    }

    // handle when cursor is in lettering content area but there's no content
    if (isLetteringLine(lineTokens)) {
      const colonIndex = line.indexOf(':');
      if (position === line.length && colonIndex !== -1) {
        return true;
      }
    }

    const tokenType = cm.getTokenTypeAt(selection.anchor);
    const nextTokenType = cm.getTokenTypeAt({
      ...selection.anchor,
      ch: selection.anchor.ch + 1
    });

    return tokenType == null
      ? isBoldable(nextTokenType)
      : isBoldable(tokenType);
  } else {
    return lineTokens
      // filter down to selected tokens
      .filter(token => token.end > selection.anchor.ch && token.start < selection.head.ch)
      .every(token => isBoldable(token.type));
  }
}

function isBoldable(tokenType: string | null): boolean {
  if (tokenType == null) return false;
  if (tokenType.includes(LETTERING_CONTENT)) return true;
  if (tokenType.includes(PARAGRAPH)) return true;

  return false;
}

function isLetteringLine(tokens: Array<Token>): boolean {
  return tokens
    .some(token => (token.type || '').includes(LETTERING_LINE))
}
