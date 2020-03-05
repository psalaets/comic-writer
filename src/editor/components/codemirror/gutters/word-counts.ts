import { Editor } from 'codemirror';
import { WordCount } from '../../../../script/types';
export const ID = 'word-counts';

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
  return function updateWordCounts(wordCounts: Array<WordCount>, prevCounts: Array<WordCount>) {
    cm.operation(() => {
      performance.mark('start:updates');

      // the fast, easy, ideal and common case
      if (sameStructure(wordCounts, prevCounts)) {
        findDifferentCounts(wordCounts, prevCounts)
          .forEach(wordCound => {
            if (shouldHaveGutter(wordCound)) {
              cm.setGutterMarker(wordCound.lineNumber - 1, ID, element(wordCound));
            } else {
              cm.setGutterMarker(wordCound.lineNumber - 1, ID, null);
            }
          });
      }
      // the slow and brute forcey case
      else {
        const currByLineNumber = wordCounts.reduce((byLine, count) => {
          byLine[count.lineNumber] = count;
          return byLine;
        }, {} as { [id: number]: WordCount });

        cm.eachLine(lineHandle => {
          const lineInfo = cm.lineInfo(lineHandle);
          const wordCount = currByLineNumber[lineInfo.line + 1];

          if (shouldHaveGutter(wordCount)) {
            cm.setGutterMarker(lineInfo.line, ID, element(wordCount));
          } else {
            if (hasGutter(lineInfo)) {
              cm.setGutterMarker(lineInfo.line, ID, null);
            }
          }
        });
      }

      performance.mark('end:updates');
      performance.measure('updates', 'start:updates', 'end:updates');
    });
  };
}

function shouldHaveGutter(wordCount: WordCount): boolean {
  return wordCount != null && wordCount.count > 0;
}

function hasGutter(lineInfo: any): boolean {
  return lineInfo.gutterMarkers != null && lineInfo.gutterMarkers[ID] != null;
}

/**
 * Tells if all nodes are in the same spot as last time. If this is true, we can
 * update word counts by finding node where their count is different.
 *
 * This happens when user is changing, but not deleting, an existing line of
 * dialogue/caption.
 *
 * @param wordCounts Current word counts
 * @param prevCounts Last time's word counts
 */
function sameStructure(wordCounts: Array<WordCount>, prevCounts: Array<WordCount>): boolean {
  const sameLength = wordCounts.length === prevCounts.length;
  if (!sameLength) return false;

  return wordCounts.every((count, index) => {
    const prev = prevCounts[index];
    return count.nodeId === prev.nodeId && count.lineNumber === prev.lineNumber;
  });
}

/**
 * Assuming structure is the same, find nodes with different word count.
 *
 * @param wordCounts
 * @param prevCounts
 */
function findDifferentCounts(wordCounts: Array<WordCount>, prevCounts: Array<WordCount>): Array<WordCount> {
  return wordCounts.filter((count, index) => {
    const prev = prevCounts[index];
    return count.count !== prev.count;
  });
}

function element(wordCount: WordCount) {
  const span = document.createElement('span');

  if (wordCount.isSpread) {
    span.classList.add('word-count--page');
  }

  span.textContent = String(wordCount.count);
  return span;
}
