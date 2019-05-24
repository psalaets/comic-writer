import { toggle } from './toggle-bold';

export function letteringBoldCommand(cm) {
  console.log('-'.repeat(50));

  const cursor = cm.getCursor();

  // split up line's tokens by their use: meta vs the actual content
  const {meta, content} = cm.getLineTokens(cursor.line)
    .reduce((obj, current) => {
      if (current.type && current.type.includes('lettering-content')) {
        obj.content.push(current);
      } else {
        obj.meta.push(current);
      }

      return obj;
    }, {meta: [], content: []});

  const selection = normalizeSelection(cm.listSelections()[0]);
  const result = toggle(content, selection.start, selection.end);

  console.log('result:');
  console.log(result);

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

// returns object with start and end, start is never to the right of end
function normalizeSelection(selection) {
  const { anchor, head } = selection;

  // on different lines
  if (anchor.line < head.line) {
    return {
      start: anchor,
      end: head
    };
  } else if (head.line < anchor.line) {
    return {
      start: head,
      end: anchor
    };
  }

  // on same line
  if (anchor.ch < head.ch) {
    return {
      start: anchor,
      end: head
    };
  } else if (head.ch < anchor.ch) {
    return {
      start: head,
      end: anchor
    };
  }

  // at same exact spot
  return {
    start: anchor,
    end: head
  };
}
