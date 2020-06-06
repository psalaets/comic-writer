import {
  observable,
  action,
  computed,
} from 'mobx';

import { ScrollPosition } from './types';
import { ScriptStore } from '../script';
import { LocatedSpread, LocatedPanel } from '../script/types';
import * as parts from '../comic-part-types';

export type EditorStore = ReturnType<typeof createStore>;

export function createStore(scriptStore: ScriptStore) {
  const store = observable({
    scroll: {
      topLine: 0
    },

    get currentSpread(): LocatedSpread | null {
      const topLine = this.scroll.topLine;
      let currentSpread: LocatedSpread | null = null;

      for (const spread of scriptStore.locatedSpreads) {
        if (spread.lineNumber <= topLine) {
          currentSpread = spread;
        } else {
          break;
        }
      }

      return currentSpread;
    },

    get currentSpreadId(): string | null {
      return this.currentSpread ? this.currentSpread.id : null;
    },

    get currentPanelId(): string | null {
      const topLine = this.scroll.topLine;
      let currentPanel: LocatedPanel | null = null;

      if (this.currentSpread) {
        for (const child of this.currentSpread.children) {
          if (child.lineNumber <= topLine) {
            if (child.type === parts.PANEL) {
              currentPanel = child;
            }
          } else {
            break;
          }
        }
      }

      return currentPanel ? currentPanel.id : null;
    },

    updateScroll(scrollWindow: ScrollPosition): void {
      this.scroll.topLine = scrollWindow.topLine;
    }
  }, {
    scroll: observable,

    currentSpread: computed,
    currentPanelId: computed,
    currentSpreadId: computed,

    updateScroll: action
  });

  return store;
}
