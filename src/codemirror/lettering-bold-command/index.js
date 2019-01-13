export function letteringBoldCommand(cm) {
  const cursor = cm.getCursor();

  if (!cm.somethingSelected()) {
    const cursor = cm.getCursor();
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
