import { wrap } from '../../../../perf';
import createClassifier from './classify';
import autoNumber from './auto-number';

/**
 * Performs auto-numbering and keyword expansion on the script source.
 *
 * @param lines Lines of the script
 * @param cursorLine What line the cursor is on
 * @param fromLine First line that could have a change
 */
export const preprocessLines = wrap('preprocessLines', preprocess);

function preprocess(
  lines: Array<string>,
  cursorLine: number,
  fromLine: number
): Array<string> {
  const needsProcessing = lines.slice(fromLine);
  const lineOffset = fromLine;

  const processedLines = needsProcessing
    .map(createClassifier(cursorLine, lineOffset))
    .map(autoNumber());

  const unchanged = lines.slice(0, fromLine);
  return unchanged.concat(processedLines);
}
