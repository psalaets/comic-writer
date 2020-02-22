import { Editor, LineWidget } from 'codemirror';
import { PanelCount } from '../../../../editor/types';

/**
 * Creates an object that shows a spread's panel count in a line widget.
 *
 * @param cm CodeMirror Editor
 */
export function create(cm: Editor) {
  let widgets: Array<LineWidget> = [];

  return {
    update(panelCounts: Array<PanelCount>) {
      cm.operation(() => {
        // clear existing widgets
        widgets.forEach(widget => widget.clear());

        // add new widgets
        widgets = panelCounts
          .filter(panelCount => panelCount.count > 0)
          .map(panelCount => cm.addLineWidget(panelCount.lineNumber - 1, node(panelCount)));
      });

      cm.refresh();
    }
  };
}

function node(panelCount: PanelCount) {
  const { count } = panelCount;

  const div = document.createElement('div');
  div.classList.add('panel-count');

  const label = count === 1 ? 'panel' : 'panels';
  div.textContent = `(${count} ${label})`;

  return div;
}
