import { Editor } from 'codemirror';
import { PanelCount } from '../../../../script/types';

/**
 * Creates an object that shows a spread's panel count in a line widget.
 *
 * @param cm CodeMirror Editor
 */
export function create(cm: Editor) {
  return {
    update(panelCounts: Array<PanelCount>) {
      cm.operation(() => {
        panelCounts
          .forEach(panelCount => {
            const lineInfo = cm.lineInfo(panelCount.lineNumber);

            if (lineInfo.widgets && lineInfo.widgets[0]) {
              // update widget
              lineInfo.widgets[0].node.textContent = widgetText(panelCount.count);
            } else {
              // add new widget
              cm.addLineWidget(panelCount.lineNumber, node(panelCount.count));
            }
          });
      });
    }
  };
}

function node(count: number) {
  const div = document.createElement('div');

  div.classList.add('panel-count');
  div.textContent = widgetText(count);

  return div;
}

function widgetText(count: number): string {
  const label = count === 1 ? 'panel' : 'panels';
  return `(${count} ${label})`;
}
