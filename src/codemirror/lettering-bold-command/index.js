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

  // nothing to transform on this line
  if (content.length === 0) {
    return;
  }

  // selection is outside of content tokens
  const selection = normalizeSelection(cm.listSelections()[0]);
  if (selection.start.ch < content[0].start) {
    return;
  }

  const chunks = toggle(content, selection.start, selection.end);

  console.log('result:');
  console.log(chunks);


  // re-construct line with toggled content tokens
  const newLine = meta.concat(chunks)
    .map(token => token.string)
    .join('');

  cm.replaceRange(newLine, {
    line: cursor.line,
    ch: 0
  }, {
    line: cursor.line,
    ch: 100000
  });

  const withStart = chunks.find(c => c.containsSelectionStart);
  const selectionStart = withStart.start + withStart.relativeSelectionStart;

  const withEnd = chunks.find(c => c.containsSelectionEnd);
  const selectionEnd = withEnd.start + withStart.relativeSelectionEnd;

  cm.setSelection(
    {
      line: cursor.line,
      ch: selectionStart
    },
    {
      line: cursor.line,
      ch: selectionEnd
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
