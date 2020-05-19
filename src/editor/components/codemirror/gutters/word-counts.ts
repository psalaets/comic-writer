import { Editor, LineHandle } from 'codemirror';
import * as perf from '../../../../perf';

import { WordCount } from '../../../../script/types';
import { LineInfo } from '../types';

export const ID = 'word-counts';

type GutterCount = {
  /**
   * The CodeMirror handle to the relevant line.
   *
   * Always use this to look up the line from an Editor. Looking up by line
   * number *seems* good but it breaks once the line has moved.
   */
  handle: LineHandle,
  /**
   * Contains the count that was last rendered for this line.
   */
  wordCount: WordCount
};

/**
 * Creates a "plugin" that shows word counts in the Editor.
 *
 * @param cm CodeMirror Editor
 */
export function create(cm: Editor) {
  return {
    update: perf.wrap('update-word-counts', createUpdater(cm))
  };
}

function createUpdater(cm: Editor) {
  /** Word count gutters from the last pass */
  let previousCounts: Array<GutterCount> = [];

  return function updateWordCounts(wordCounts: Array<WordCount>, prevCounts: Array<WordCount>) {
    cm.operation(() => {
      /** Word count gutters in this pass */
      const nextCounts: Array<GutterCount> = [];
      /** Zero-based line numbers that have been updated in this pass */
      const updatedLines = new Set<number>();

      const wordCountsByLineNumber = wordCounts.reduce((byLine, wordCount) => {
        byLine[wordCount.lineNumber] = wordCount;
        return byLine;
      }, {} as {[id: number]: WordCount});

      // Look at all lines that had gutters on the last pass, and see if the
      // gutter should be updated, left alone or removed.
      previousCounts
        .forEach(previousCount => {
          const lineInfo = cm.lineInfo(previousCount.handle) as LineInfo;

          // Line was deleted, there's no gutter to care about
          if (!lineInfo) return;

          // Look up the line's word count for this pass, if any
          const wordCount = wordCountsByLineNumber[lineInfo.line];

          if (shouldHaveGutter(wordCount)) {
            // mark this line as: word count has been updated
            updatedLines.add(wordCount.lineNumber);

            // count changed so we actually need to update the gutter
            if (isDifferent(wordCount, previousCount.wordCount)) {
              nextCounts.push({
                handle: cm.setGutterMarker(lineInfo.line, ID, makeGutterElement(wordCount)),
                wordCount
              });
            } else {
              // count didn't change, gutter should remain as-is
              nextCounts.push(previousCount);
            }
          } else { // count should be removed
            if (hasGutter(lineInfo)) {
              cm.setGutterMarker(lineInfo.line, ID, null);
            }
          }
        });

      // Render newly added word counts
      wordCounts
        // ignore counts that don't need a gutter
        .filter(wordCount => shouldHaveGutter(wordCount))
        // ignore counts that were updated above
        .filter(wordCount => !updatedLines.has(wordCount.lineNumber))
        .forEach(wordCount => {
          nextCounts.push({
            handle: cm.setGutterMarker(wordCount.lineNumber, ID, makeGutterElement(wordCount)),
            wordCount
          });
        });

      // all counts on this pass will become the "old counts" for next pass
      previousCounts = nextCounts;
    });
  };
}

function isDifferent(countA: WordCount, countB: WordCount): boolean {
  return countA.count !== countB.count || countA.isSpread !== countB.isSpread;
}

function shouldHaveGutter(wordCount: WordCount): boolean {
  return wordCount != null && wordCount.count > 0;
}

function hasGutter(lineInfo: LineInfo): boolean {
  return lineInfo.gutterMarkers != null && lineInfo.gutterMarkers[ID] != null;
}

function makeGutterElement(wordCount: WordCount) {
  const span = document.createElement('span');
  span.classList.add('word-count');

  if (wordCount.isSpread) {
    span.classList.add('word-count--page');
  }

  span.textContent = String(wordCount.count);

  return span;
}
