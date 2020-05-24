import { Editor, LineWidget, LineHandle } from 'codemirror';
import * as perf from '../../../../perf';

import { PanelCount } from '../../../../script/types';

export interface PanelCountUpdater {
  (cm: CodeMirror.Editor, counts: Array<PanelCount>): void;
}

/**
 * Internal type for tracking existing panel counts.
 */
interface LineWidgetCount {
  /**
   * Contains the count that was last rendered for the line.
   */
  panelCount: PanelCount,
  /**
   * Line widget - this has a method to clear the widget.
   */
  widget: LineWidget,
  /**
   * The CodeMirror handle to the relevant line.
   *
   * Always use this to look up the line from an Editor. Looking up by line
   * number *seems* good but it breaks once the line has moved.
   */
  handle: LineHandle,
  /**
   * The dom node for the line widget.
   */
  node: HTMLElement
}

/**
 * Creates a "plugin" that shows panel counts in the editor.
 */
export function create() {
  /** Panel counts from the last pass */
  let previousCounts: Array<LineWidgetCount> = [];

  return perf.wrap('updatePanelCounts', updatePanelCounts);

  function updatePanelCounts(cm: Editor, panelCounts: Array<PanelCount>) {
    cm.operation(() => {
      /** Panel counts in this pass */
      const nextCounts: Array<LineWidgetCount> = [];
      /** Zero-based line numbers that have been updated in this pass */
      const updatedLines = new Set<number>();

      const panelCountsByLineNumber = panelCounts.reduce((byLine, panelCount) => {
        byLine[panelCount.lineNumber] = panelCount;
        return byLine;
      }, {} as { [id: number]: PanelCount });

      // update/remove existing counts
      previousCounts.forEach(previousCount => {
        // Look up line number by handle instead of just getting it off of the
        // previous panelCount. Cached line numbers aren't good line identifiers
        // because lines move. Line handles aren't affecting by moving lines.
        const lineNumber = cm.getLineNumber(previousCount.handle);

        // Line that had this count no longer exists
        if (lineNumber == null) {
          previousCount.widget.clear();
          return;
        }

        const panelCount = panelCountsByLineNumber[lineNumber];

        // Line that had this count is no longer a spread line
        if (!panelCount) {
          previousCount.widget.clear();
          return;
        }

        // Spread that had this count no longer has panels
        if (!shouldShowCount(panelCount)) {
          previousCount.widget.clear();
          return;
        }

        // Getting this far means the previous panel count should be kept. The
        // only remaining question is if it should be updated or not.

        updatedLines.add(panelCount.lineNumber);

        if (isDifferent(panelCount, previousCount.panelCount)) {
          // update count and add it to the next set of counts
          nextCounts.push({
            panelCount: panelCount,
            widget: previousCount.widget,
            handle: previousCount.handle,
            node: updateCountNode(previousCount.node, panelCount)
          });
        } else {
          // no change - so just add it to the next set of counts
          nextCounts.push(previousCount);
        }
      });

      // add new counts
      panelCounts
        // ignore counts that don't need to be shown
        .filter(panelCount => shouldShowCount(panelCount))
        // ignore counts for line that were handled above, they aren't new
        .filter(panelCount => !updatedLines.has(panelCount.lineNumber))
        .forEach(panelCount => {
          const countNode = makeCountNode(panelCount);

          nextCounts.push({
            panelCount,
            widget: cm.addLineWidget(panelCount.lineNumber, countNode),
            handle: cm.getLineHandle(panelCount.lineNumber),
            node: countNode
          });
        });

      // all counts added/kept on this pass become previous counts for next pass
      previousCounts = nextCounts;
    });
  };
}

function shouldShowCount(panelCount: PanelCount): boolean {
  return panelCount.count > 0;
}

function isDifferent(a: PanelCount, b: PanelCount): boolean {
  return a.count !== b.count;
}

function makeCountNode(panelCount: PanelCount): HTMLElement {
  const node = document.createElement('span');
  node.classList.add('panel-count');

  updateCountNode(node, panelCount);

  return node;
}

function updateCountNode<T extends HTMLElement>(node: T, panelCount: PanelCount): T {
  node.textContent = widgetText(panelCount.count);
  return node;
}

function widgetText(count: number): string {
  const label = count === 1 ? 'panel' : 'panels';
  return `(${count} ${label})`;
}
