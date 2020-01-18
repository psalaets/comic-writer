import { Editor } from 'codemirror';
import { isSpreadStats, ComicStats } from '../../store/selectors/stat-types';
export const ID = 'word-counts';

export function create(cm: Editor) {
  return {
    update(stats: ComicStats[]) {
      cm.operation(() => {
        // clear
        cm.clearGutter(ID);

        // set new counts
        stats
          .filter(stat => stat.wordCount > 0)
          .forEach(stat => {
            cm.setGutterMarker(stat.lineNumber - 1, ID, element(stat))
          });
      });
    }
  };
}

function element(stat: ComicStats) {
  const span = document.createElement('span');

  if (isSpreadStats(stat)) {
    span.classList.add('word-count--page');
  }

  span.textContent = String(stat.wordCount);
  return span;
}
