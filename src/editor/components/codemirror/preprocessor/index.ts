import * as perf from '../../../../perf';
import createClassifier from './classify';
import createAutoNumberer from './auto-number';
import { capitalizeLetteringMetadata } from './capitalize-lettering-metadata';
import { LineClassification } from './types';

interface PreprocessorInput {
  /** Lines of the script */
  lines: Array<string>;
  /** What line (zero based) the cursor is on, after the change */
  cursorLine: number;
  /** Zero-based line number of first line in the script that has a change */
  fromLine: number;
  /** Zero-based line number of last line in the script that has a change */
  toLine: number;
}

export interface LinePreprocessor {
  (input: PreprocessorInput): Array<string>;
}

export function createPreprocessor(): LinePreprocessor {
  let lastClassifications: Array<LineClassification> = [];

  return perf.wrap('preprocessLines', preprocess);

  /**
   * Performs auto-numbering and keyword expansion on the script source.
   */
  function preprocess(input: PreprocessorInput): Array<string> {
    const {
      lines,
      cursorLine,
      fromLine,
      toLine
    } = input;

    perf.start('classify-lines');

    const unchangedClassifications = lastClassifications.slice(0, fromLine);
    const changedLines = lines.slice(unchangedClassifications.length);

    const changedClassifications = changedLines
      .map(createClassifier(cursorLine, unchangedClassifications.length));

    const allClassifications = unchangedClassifications.concat(changedClassifications);
    lastClassifications = allClassifications;

    perf.end('classify-lines');
    perf.start('number-lines');

    const numberedLines = lines
      .map(createAutoNumberer(allClassifications));

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
