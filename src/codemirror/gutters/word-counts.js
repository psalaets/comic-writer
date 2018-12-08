import { DIALOGUE, CAPTION } from '../../types';
export const ID = 'word-counts';

export function create(cm) {
  return {
    update(stats) {
      // clear
      cm.getDoc().clearGutter(ID);

      // set new counts
      stats.forEach(tuple => {
        const line = tuple.lineNumber - 1;
        cm.getDoc().setGutterMarker(line, ID, element(tuple));
      });
    }
  };
}

function element(tuple) {
  const span = document.createElement('span');

  if (tuple.type === DIALOGUE || tuple.type === CAPTION) {
    span.classList.add('word-count--lettering');
  }

  span.textContent = tuple.wordCount;
  return span;
}