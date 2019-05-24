import { PAGE } from '../../types';
export const ID = 'word-counts';

export function create(cm) {
  return {
    update(stats) {
      cm.operation(() => {
        // clear
        cm.clearGutter(ID);

        // set new counts
        stats
          .filter(tuple => tuple.wordCount > 0)
          .forEach(tuple => {
            cm.setGutterMarker(tuple.lineNumber - 1, ID, element(tuple))
          });
      });
    }
  };
}

function element(tuple) {
  const span = document.createElement('span');

  if (tuple.type === PAGE) {
    span.classList.add('word-count--page');
  }

  span.textContent = tuple.wordCount;
  return span;
}