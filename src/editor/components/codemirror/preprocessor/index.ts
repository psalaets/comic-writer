import * as perf from '../../../../perf';
import classifyLines from './classify-lines';
import autoNumber from './auto-number';

/**
 * Performs auto-numbering and keyword expansion on the script source.
 *
 * @param lines Lines of the script
 * @param cursorLine What line the cursor is on
 */
export function preprocessLines(
  lines: Array<string>,
  cursorLine: number
): Array<string> {
  perf.start('preprocess-source');

  const processedLines = lines
    .map(classifyLines(cursorLine))
    .map(autoNumber());

  perf.end('preprocess-source');

  return processedLines;
}
