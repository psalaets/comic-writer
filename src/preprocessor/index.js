import classifyLines from './classify-lines';
import autoNumber from './auto-number';

export function preprocessLines(lines, cursorLine) {
  return lines
    .map(classifyLines(cursorLine))
    .map(autoNumber());
}
