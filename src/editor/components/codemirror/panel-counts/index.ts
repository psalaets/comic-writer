import { Editor } from 'codemirror';
import { PanelCount } from '../../../../script/types';
import { LineWrapper } from './line-wrapper';

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
