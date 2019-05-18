import Line from './line';

export function toggle(tokens, selectionStart, selectionEnd) {
  const line = new Line(tokens, selectionStart, selectionEnd);
  return line.execute();
}
