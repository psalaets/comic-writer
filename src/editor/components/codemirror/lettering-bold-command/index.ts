import CodeMirror from 'codemirror';
import { toggle } from './toggle';
import { LETTERING_CONTENT } from '../mode/token';

interface TokensByUse {
  meta: Array<CodeMirror.Token>,
  content: Array<CodeMirror.Token>
}

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
  const cursor = cm.getCursor();

  // split up line's tokens by their use: meta vs the actual content
  const {meta, content} = cm.getLineTokens(cursor.line)
    .reduce<TokensByUse>((obj, current) => {
      if (current.type && current.type.includes(LETTERING_CONTENT)) {
        obj.content.push(current);
      } else {
        obj.meta.push(current);
      }

      return obj;
    }, {meta: [], content: []});

  const selection = normalizeSelection(cm.listSelections()[0]);
  const result = toggle(content, selection.anchor, selection.head);

  // re-construct line with toggled content tokens
  const metaString = meta
    .map(token => token.string)
    .join('');

  const newLine = metaString + result.string;

  cm.replaceRange(newLine, {
    line: cursor.line,
    ch: 0
  }, {
    line: cursor.line,
    ch: 100000
  });

  cm.setSelection(
    {
      line: cursor.line,
      ch: result.selectionStart
    },
    {
      line: cursor.line,
      ch: result.selectionEnd
    }
  );
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
