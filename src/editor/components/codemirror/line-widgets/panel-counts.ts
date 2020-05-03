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

class LineWrapper {
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
        // update existing widget
        widget.node.textContent = widgetText(panelCount.count);
        widget.node.dataset.line = String(panelCount.lineNumber);
      } else {
        // remove existing widget
        widget.clear();
      }
    } else {
      if (shouldShowCount) {
        // add new widget
        this.cm.addLineWidget(this.lineNumber, node(panelCount));
      }
    }
  }
}

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
            const lineWrapper = new LineWrapper(panelCount.lineNumber, cm);
            lineWrapper.setPanelCount(panelCount);
          });
      });
    }
  };
}

function node(panelCount: PanelCount) {
  const { count, lineNumber } = panelCount;
  const div = document.createElement('div');

  div.dataset.line = String(lineNumber);
  div.classList.add('panel-count');
  div.textContent = widgetText(count);

  return div;
}

function widgetText(count: number): string {
  const label = count === 1 ? 'panel' : 'panels';
  return `(${count} ${label})`;
}
