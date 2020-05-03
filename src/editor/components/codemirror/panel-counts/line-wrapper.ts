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
 * Helper class for managing panel count line widgets.
 */
export class LineWrapper {
  lineNumber: number;
  cm: Editor;

  constructor(lineNumber: number, cm: Editor) {
    this.lineNumber = lineNumber;
    this.cm = cm;
  }

  setPanelCount(panelCount: PanelCount): void {
    const shouldShowCount = panelCount.count > 0;
    const lineInfo = this.cm.lineInfo(this.lineNumber) as LineInfo;
    const widget = lineInfo.widgets && lineInfo.widgets[0];

    if (widget) {
      if (shouldShowCount) {
        updateNode(widget.node, panelCount);
      } else {
        widget.clear();
      }
    } else {
      if (shouldShowCount) {
        this.cm.addLineWidget(this.lineNumber, node(panelCount));
      }
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
  node.dataset.line = String(panelCount.lineNumber);
}

function widgetText(count: number): string {
  const label = count === 1 ? 'panel' : 'panels';
  return `(${count} ${label})`;
}
