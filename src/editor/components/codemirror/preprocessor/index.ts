import * as perf from '../../../../perf';
import createClassifier from './classify';
import autoNumber from './auto-number';
import { LineClassification } from './types';

export interface LinePreprocessor {
  (lines: Array<string>, cursorLine: number, fromLine: number): Array<string>;
}

export function createPreprocessor(): LinePreprocessor {
  let lastClassifications: Array<LineClassification> = [];

  return perf.wrap('preprocessLines', preprocess);

  /**
   * Performs auto-numbering and keyword expansion on the script source.
   *
   * @param lines Lines of the script
   * @param cursorLine What line number the cursor is on
   * @param fromLine Line number of first line in the script that has a change
   */
  function preprocess(
    lines: Array<string>,
    cursorLine: number,
    fromLine: number
  ): Array<string> {

    perf.start('classify-lines');

    const unchangedClassifications = lastClassifications.slice(0, fromLine);
    const changedLines = lines.slice(unchangedClassifications.length);

    const changedClassifications = changedLines
      .map(createClassifier(cursorLine, fromLine));

    const allClassifications
      = lastClassifications
      = unchangedClassifications.concat(changedClassifications);

    perf.end('classify-lines');
    perf.start('number-lines');

    const numberedLines = allClassifications
      .map(autoNumber());

    perf.end('number-lines');

    return numberedLines;
  };
}
