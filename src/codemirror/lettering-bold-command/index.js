import { toggle } from './toggle-bold';

export function letteringBoldCommand(cm) {
  const cursor = cm.getCursor();
  const selections = cm.listSelections();

  const {meta, content} = cm.getLineTokens(cursor.line)
    .reduce((obj, current) => {
      if (current.type && current.type.includes('lettering-content')) {
        obj.content.push(current);
      } else {
        obj.meta.push(current);
      }

      return obj;
    }, {meta: [], content: []});

  const selection = normalizeSelection(selections[0]);
  const toggledContent = toggle(content, selection.start, selection.end);

  const newTokens = meta.concat(toggledContent);
  const newLine = newTokens
    .map(token => token.string)
    .join('');

  cm.replaceRange(newLine, {
    line: cursor.line,
    ch: 0
  }, {
    line: cursor.line,
    ch: 100000
  });
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
