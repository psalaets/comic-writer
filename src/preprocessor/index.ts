import classifyLines from './classify-lines';
import autoNumber from './auto-number';

export function preprocessLines(
  lines: Array<string>,
  cursorLine: number
): Array<string> {
  return lines
    .map(classifyLines(cursorLine))
    .map(autoNumber());
}
