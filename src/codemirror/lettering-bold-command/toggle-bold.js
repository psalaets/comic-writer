import Line from './line';

export function toggle(tokens, selectionStart, selectionEnd) {
  const line = new Line(tokens, selectionStart, selectionEnd);
  const chunks = line.execute();

  const withStart = chunks.find(c => c.containsSelectionStart);
  const withEnd = chunks.find(c => c.containsSelectionEnd);

  return {
    string: chunks.map(c => c.string).join(''),
    selectionStart: withStart.start + withStart.relativeSelectionStart,
    selectionEnd: withEnd.start + withStart.relativeSelectionEnd
  };
}
