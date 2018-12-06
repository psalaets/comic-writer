export const ID = 'word-counts';

export function create(cm) {
  return {
    update(wordCounts) {
      // clear
      cm.getDoc().clearGutter(ID);

      // set new counts
      wordCounts.forEach(pair => {
        const line = pair.lineNumber - 1;
        cm.getDoc().setGutterMarker(line, ID, element(pair.count));
      });
    }
  };
}

function element(count) {
  const span = document.createElement('span');
  span.textContent = count;
  return span;
}