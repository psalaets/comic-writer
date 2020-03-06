import { Editor, LineHandle } from 'codemirror';
import { WordCount } from '../../../../script/types';
export const ID = 'word-counts';

type HandleTuple = {
  handle: LineHandle,
  wordCount: WordCount
};

/**
 * Creates an object that updates the word counts gutter in the CodeMirror
 * Editor.
 *
 * @param cm CodeMirror Editor
 */
export function create(cm: Editor) {
  return {
    update: createUpdater(cm)
  };
}

function createUpdater(cm: Editor) {
  /** Lines (w/metadata) that had word count gutters in the last pass */
  let existingHandles: Array<HandleTuple> = [];

  return function updateWordCounts(wordCounts: Array<WordCount>, prevCounts: Array<WordCount>) {
    cm.operation(() => {
      /** Lines (w/metadata) that have word count gutters in this pass */
      const newHandles: Array<HandleTuple> = [];
      /** One-based line numbers that have been updated on this pass */
      const updatedLines = new Set<number>();

      const wordCountsByLineNumber = wordCounts.reduce((byLine, wordCount) => {
        byLine[wordCount.lineNumber] = wordCount;
        return byLine;
      }, {} as {[id: number]: WordCount});

      // Look at all lines that had gutters on the last pass, and see if the
      // gutter should be updated, left alone or removed.
      existingHandles
        .forEach(tuple => {
          const lineInfo = cm.lineInfo(tuple.handle);

          // Line was deleted, there's no gutter to care about
          if (!lineInfo) return;

          // Look up the line's word count for this pass, if any
          const wordCount = wordCountsByLineNumber[lineInfo.line + 1];

          if (shouldHaveGutter(wordCount)) {
            // mark this line as: word count has been updated
            updatedLines.add(wordCount.lineNumber);

            // count changed so we actually need to update the gutter
            if (different(wordCount, tuple.wordCount)) {
              newHandles.push({
                handle: cm.setGutterMarker(lineInfo.line, ID, element(wordCount)),
                wordCount
              });
            } else {
              // count didn't change, gutter should remain as-is
              newHandles.push(tuple);
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
        // show the count
        .forEach(wordCount => {
          newHandles.push({
            handle: cm.setGutterMarker(wordCount.lineNumber - 1, ID, element(wordCount)),
            wordCount
          });
        });

      // all count on this pass will become the "old counts" for next pass
      existingHandles = newHandles;
    });
  };
}

function different(countA: WordCount, countB: WordCount): boolean {
  return countA.count !== countB.count || countA.isSpread !== countB.isSpread;
}

function shouldHaveGutter(wordCount: WordCount): boolean {
  return wordCount != null && wordCount.count > 0;
}

function hasGutter(lineInfo: any): boolean {
  return lineInfo.gutterMarkers != null && lineInfo.gutterMarkers[ID] != null;
}

function element(wordCount: WordCount) {
  const span = document.createElement('span');

  if (wordCount.isSpread) {
    span.classList.add('word-count--page');
  }

  span.textContent = String(wordCount.count);
  return span;
}
