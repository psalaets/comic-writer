import { DIALOGUE, CAPTION } from '../../parser/types';
export const ID = 'word-counts';

export function create(cm) {
  return {
    update(wordCounts) {
      // clear
      cm.getDoc().clearGutter(ID);

      // set new counts
      wordCounts.forEach(tuple => {
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

  span.textContent = tuple.count;
  return span;
}