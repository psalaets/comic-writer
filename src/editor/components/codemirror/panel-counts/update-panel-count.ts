import { Editor } from 'codemirror';
import { PanelCount } from '../../../../script/types';

// CodeMirror typings don't have a named type for this yet so this will have
// to suffice.
interface LineInfo {
  line: any;
  handle: any;
  text: string;
  /** Object mapping gutter IDs to marker elements. */
  gutterMarkers: any;
  textClass: string;
  bgClass: string;
  wrapClass: string;
  /** Array of line widgets attached to this line. */
  widgets: any;
}

/**
 * Helper for updating panel counts in the editor.
 */
export function updatePanelCount(panelCount: PanelCount, cm: Editor): void {
  const lineNumber = panelCount.lineNumber;
  const lineInfo = cm.lineInfo(lineNumber) as LineInfo;
  const widget = lineInfo.widgets && lineInfo.widgets[0];

  const shouldShowCount = panelCount.count > 0;

  if (widget) {
    if (shouldShowCount) {
      updateNode(widget.node, panelCount);
    } else {
      widget.clear();
    }
  } else {
    if (shouldShowCount) {
      cm.addLineWidget(lineNumber, node(panelCount));
    }
  }
}

function node(panelCount: PanelCount) {
  const div = document.createElement('div');
  div.classList.add('panel-count');

  updateNode(div, panelCount);

  return div;
}

function updateNode(node: HTMLElement, panelCount: PanelCount): void {
  node.textContent = widgetText(panelCount.count);
}

function widgetText(count: number): string {
  const label = count === 1 ? 'panel' : 'panels';
  return `(${count} ${label})`;
}
