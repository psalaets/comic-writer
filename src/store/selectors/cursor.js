import { createSelector } from 'reselect';

const lineSelector = state => state.editor.cursor.line;
const chSelector = state => state.editor.cursor.ch;

export const cursorSelector = createSelector(
  [lineSelector, chSelector],
  (line, ch) => ({line, ch})
);
