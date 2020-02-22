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
    update(wordCounts: Array<WordCount>) {
      cm.operation(() => {
        // clear
        cm.clearGutter(ID);

        // set new counts
        wordCounts
          .filter(wordCount => wordCount.count > 0)
          .forEach(wordCount => {
            cm.setGutterMarker(wordCount.lineNumber - 1, ID, element(wordCount))
          });
      });
    }
  };
}

function element(wordCount: WordCount) {
  const span = document.createElement('span');

  if (wordCount.isSpread) {
    span.classList.add('word-count--page');
  }

  span.textContent = String(wordCount.count);
  return span;
}
