export function letteringBoldCommand(cm) {
  const cursor = cm.getCursor();

  if (cm.somethingSelected()) {
    const selections = cm.listSelections();

    if (selections.length > 0) {
      const selection = orderLeftToRight(selections[0]);
      const selectedText = cm.getRange(...selection);

      cm.replaceRange(`**${selectedText}**`, ...selection);
    }
  } else {
    cm.replaceRange('****', {
      line: cursor.line,
      ch: cursor.ch
    });
    cm.setCursor({
      line: cursor.line,
      ch: cursor.ch + 2
    });
  }
}

function orderLeftToRight(selection) {
  const {anchor, head} = selection;

  // on different lines
  if (anchor.line < head.line) {
    return [anchor, head];
  } else if (head.line < anchor.line) {
    return [head, anchor];
  }

  // on same line
  if (anchor.ch < head.ch) {
    return [anchor, head];
  } else if (head.ch < anchor.ch) {
    return [head, anchor];
  }

  // at same exact spot
  return [anchor, head];
}