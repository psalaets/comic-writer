export function letteringBoldCommand(cm) {
  const cursor = cm.getCursor();

  if (cm.somethingSelected()) {
    const selections = cm.listSelections();

    if (selections.length > 0) {
      const selection = selections[0];
      const selectedText = cm.getRange(selection.anchor, selection.head);

      cm.replaceRange(`**${selectedText}**`, selection.anchor, selection.head);
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
