import * as perf from '../../../../perf';
import createClassifier from './classify';
import autoNumber from './auto-number';
import { capitalizeLetteringMetadata } from './capitalize-lettering-metadata';
import { LineClassification } from './types';

export interface LinePreprocessor {
  (lines: Array<string>, cursorLine: number, fromLine: number, toLine: number): Array<string>;
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
   * @param toLine Line number of last line in the script that has a change
   */
  function preprocess(
    lines: Array<string>,
    cursorLine: number,
    fromLine: number,
    toLine: number
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
    perf.start('allcaps-lettering-metadata');

    const needsAllCaps = numberedLines.slice(fromLine, toLine + 1);
    const hasAllCaps = needsAllCaps
      .map(line => capitalizeLetteringMetadata(line));

    const unchangedBefore = numberedLines.slice(0, fromLine);
    const unchangedAfter = numberedLines.slice(toLine + 1);

    const finalLines = unchangedBefore
      .concat(hasAllCaps)
      .concat(unchangedAfter);

    perf.end('allcaps-lettering-metadata');

    return finalLines;
  };
}
