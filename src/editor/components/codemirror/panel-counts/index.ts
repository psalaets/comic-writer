import { Editor } from 'codemirror';
import { PanelCount } from '../../../../script/types';
import { updatePanelCount } from './update-panel-count';

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
          .forEach(panelCount => updatePanelCount(panelCount, cm));
      });
    }
  };
}
