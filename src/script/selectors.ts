import { createSelector } from 'reselect';
import { createArraySelector } from 'reselect-map';

import { Dialogue, SpreadLines } from '../parser/types';
import { parsePreSpreadLines, parseSpreadLines } from '../parser';

import { wrap } from '../perf';

import { RootState } from '../store/types';
import {
  ScriptState,
  PanelCount,
  WordCount,
  LocatedSpreadNodes,
  LocatedSpread
} from './types';
import * as parts from '../comic-part-types';
import * as iterators from './iterator';

function selectScriptState(state: RootState): ScriptState {
  return state.script;
}

export function selectSource(state: RootState): string {
  return selectScriptState(state).source;
}

function selectPreSpreadLines(state: RootState): Array<string> {
  return selectScriptState(state).preSpread;
}

function selectSpreadLines(state: RootState): Array<SpreadLines> {
  return selectScriptState(state).spreads;
}

export const selectSpreadNodes = wrap('selectSpreadNodes', createArraySelector(
  selectSpreadLines,
  spread => parseSpreadLines(spread)
));

export const selectPreSpreadNodes = wrap('selectPreSpreadNodes', createSelector(
  selectPreSpreadLines,
  preSpreadLines => parsePreSpreadLines(preSpreadLines)
));

const selectPreSpreadLineCount = createSelector(
  selectPreSpreadLines,
  lines => lines.length
);

const selectLocatedNodesBySpread = wrap('selectLocatedNodesBySpread', createSelector(
  [selectPreSpreadLineCount, selectSpreadNodes],
  (preSpreadLineCount, allSpreadNodes): Array<LocatedSpreadNodes> => {
    let lineNumber = preSpreadLineCount;

    return allSpreadNodes.map(spreadNodes => {
      const locatedSpread: LocatedSpread = {
        ...spreadNodes.spread,
        lineNumber: lineNumber++
      };

      const locatedChildren = spreadNodes.children
        .map(child => ({ ...child, lineNumber: lineNumber++ }));

      return {
        spread: locatedSpread,
        children: locatedChildren
      }
    });
  }
));

const selectDialogues = wrap('selectDialogues', createSelector(
  selectSpreadNodes,
  allSpreadNodes => {
    const dialogues: Array<Dialogue> = [];

    for (const node of iterators.spreadsAndChildren(allSpreadNodes)) {
      if (node.type === parts.DIALOGUE) {
        dialogues.push(node);
      }
    }

    return dialogues;
  }
));

export const selectSpeakers = wrap('selectSpeakers', createSelector(
  selectDialogues,
  dialogues => {
    const speakers = dialogues
      .map(dialogue => dialogue.speaker.toUpperCase());

    return dedupe(speakers).sort();
  }
));


function dedupe(speakers: Array<string>): Array<string> {
  return [...new Set(speakers)];
}

export const selectPanelCounts = wrap('selectPanelCounts', createSelector(
  selectLocatedNodesBySpread,
  allLocatedSpreadNodes => {
    const panelCounts: Array<PanelCount> = [];

    for (const spread of iterators.onlySpreads(allLocatedSpreadNodes)) {
      if (spread.panelCount > 0) {
        panelCounts.push({
          lineNumber: spread.lineNumber,
          count: spread.panelCount
        });
      }
    }

    return panelCounts;
  }
));

export const selectWordCounts = wrap('selectWordCounts', createSelector(
  selectLocatedNodesBySpread,
  allLocatedSpreadNodes => {
    const wordCounts: Array<WordCount> = [];

    for (const node of iterators.spreadsAndChildren(allLocatedSpreadNodes)) {
      if (node.type === parts.DIALOGUE || node.type === parts.CAPTION) {
        wordCounts.push({
          count: node.wordCount,
          lineNumber: node.lineNumber,
          isSpread: false
        });
      } else if (node.type === parts.PANEL || node.type === parts.SPREAD) {
        wordCounts.push({
          count: node.dialogueWordCount + node.captionWordCount,
          lineNumber: node.lineNumber,
          isSpread: node.type === parts.SPREAD
        });
      }
    }

    return wordCounts;
  }
));
