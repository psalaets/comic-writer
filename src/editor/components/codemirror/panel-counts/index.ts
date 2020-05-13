import { Editor } from 'codemirror';
import { PanelCount } from '../../../../script/types';
import { updatePanelCount } from './update-panel-count';

/**
 * Creates a "plugin" that shows panel counts in the editor.
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
