import { Editor } from 'codemirror';
import * as perf from '../../../../perf';

import { PanelCount } from '../../../../script/types';
import { updatePanelCount } from './update-panel-count';

/**
 * Creates a "plugin" that shows panel counts in the editor.
 *
 * @param cm CodeMirror Editor
 */
export function create(cm: Editor) {
  return {
    update: perf.wrap('update-panel-counts', update)
  };

  function update(panelCounts: Array<PanelCount>) {
    cm.operation(() => {
      panelCounts
        .forEach(panelCount => updatePanelCount(panelCount, cm));
    });
  }
}
