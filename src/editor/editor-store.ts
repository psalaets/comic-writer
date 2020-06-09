import {
  observable,
  action,
  computed,
} from 'mobx';

import { NO_TARGET_LINE } from './constants';
import { ScrollPosition, SpreadOutlineItem, OutlineItem } from './types';
import { ScriptStore } from '../script';
import { LocatedSpread, LocatedPanel } from '../script/types';
import * as parts from '../comic-part-types';

export type EditorStore = ReturnType<typeof createStore>;

export function createStore(scriptStore: ScriptStore) {
  const store = observable({
    scroll: {
      topLine: 0
    },

    targetLine: NO_TARGET_LINE,

    get outlineItems(): Array<SpreadOutlineItem> {
      return scriptStore.locatedSpreads
        .map(spread => {
          const panels = spread.children
            .filter((child): child is LocatedPanel => child.type === parts.PANEL)
            .map(panel => {
              return {
                id: panel.id,
                panelNumber: panel.number,
                lineNumber: panel.lineNumber,
                current: panel.id === this.currentItemId,
                description: panel.description
              };
            });

          return {
            id: spread.id,
            label: spread.label,
            lineNumber: spread.lineNumber,
            current: spread.id === this.currentItemId,
            panels
          };
        });
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

    get currentItemId(): string | null {
      if (this.currentPanelId) return this.currentPanelId;
      if (this.currentSpreadId) return this.currentSpreadId;
      return null;
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
      this.targetLine = NO_TARGET_LINE;
    },
    selectOutlineItem(item: OutlineItem): void {
      this.targetLine = item.lineNumber;
    }
  }, {
    scroll: observable,
    targetLine: observable,

    outlineItems: computed,
    currentSpread: computed,
    currentItemId: computed,
    currentPanelId: computed,
    currentSpreadId: computed,

    updateScroll: action,
    selectOutlineItem: action,
  });

  return store;
}
