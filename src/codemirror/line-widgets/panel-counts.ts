import { Editor, LineWidget } from 'codemirror';
import { ComicStats, SpreadStats, isSpreadStats } from '../../stats/types';

/**
 * Creates an object that shows a spread's panel count in a line widget.
 *
 * @param cm CodeMirror Editor
 */
export function create(cm: Editor) {
  let widgets: Array<LineWidget> = [];

  return {
    update(stats: Array<ComicStats>) {
      cm.operation(() => {
        // clear existing widgets
        widgets.forEach(widget => widget.clear());

        // add new widgets
        widgets = stats
          .filter(isSpreadStats)
          .filter(spread => spread.panelCount > 0)
          .map(spread => cm.addLineWidget(spread.lineNumber - 1, node(spread)));
      });

      cm.refresh();
    }
  };
}

function node(spreadStats: SpreadStats) {
  const { panelCount } = spreadStats;

  const div = document.createElement('div');
  div.classList.add('panel-count');

  const label = panelCount === 1 ? 'panel' : 'panels';
  div.textContent = `(${panelCount} ${label})`;

  return div;
}
