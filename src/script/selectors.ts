import { createSelector } from 'reselect';

import { Dialogue } from '../parser/types';
import { parsePreSpreadLines, parseSpreadLines } from '../parser';

import { wrap } from '../perf';

import { RootState } from '../store/types';
import { ScriptState, PanelCount, WordCount, SpreadLines, LocatedComicNode } from './types';
import * as parts from '../comic-part-types';
import { iterator } from './iterator';

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

export const selectNodesBySpread = createSelector(
  selectSpreadLines,
  spreads => spreads.map(spread => parseSpreadLines(spread.lines))
);

export const selectPreSpreadNodes = createSelector(
  selectPreSpreadLines,
  preSpreadLines => parsePreSpreadLines(preSpreadLines)
)

const selectPreSpreadLineCount = createSelector(
  selectPreSpreadLines,
  lines => lines.length
);

const selectLocatedPreSpreadNodes = createSelector(
  selectPreSpreadNodes,
  (nodes): Array<LocatedComicNode> => {
    return nodes.map((node, lineNumber) => ({node, lineNumber}));
  }
);

const selectLocatedNodesBySpread = createSelector(
  [selectPreSpreadLineCount, selectNodesBySpread],
  (preSpreadLineCount, nodesBySpread): Array<Array<LocatedComicNode>> => {
    let lineNumber = preSpreadLineCount;

    return nodesBySpread.map(nodes => {
      return nodes.map(node => {
        return {
          node,
          lineNumber: lineNumber++
        };
      });
    });
  }
);

const selectDialogues = wrap('selectDialogues', createSelector(
  [selectPreSpreadNodes, selectNodesBySpread],
  (preSpreadNodes, nodesBySpread) => {
    const dialogues: Array<Dialogue> = [];

    for (const node of iterator(preSpreadNodes, nodesBySpread)) {
      if (node.type === parts.DIALOGUE) {
        dialogues.push(node);
      }
    }

    return dialogues;
  }
));

export const selectSpeakers = wrap('selectSpeakers', createSelector(
  [selectDialogues],
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
  [selectLocatedPreSpreadNodes, selectLocatedNodesBySpread],
  (preSpreadNodes, nodesBySpread) => {
    const panelCounts = [] as Array<PanelCount>;

    for (const located of iterator(preSpreadNodes, nodesBySpread)) {
      if (located.node.type === parts.SPREAD && located.node.panelCount > 0) {
        panelCounts.push({
          lineNumber: located.lineNumber,
          count: located.node.panelCount
        });
      }
    }

    return panelCounts;
  }
));

export const selectWordCounts = wrap('selectWordCounts', createSelector(
  [selectLocatedPreSpreadNodes, selectLocatedNodesBySpread],
  (preSpreadNodes, nodesBySpread) => {
    const wordCounts: Array<WordCount> = [];

    for (const located of iterator(preSpreadNodes, nodesBySpread)) {
      if (located.node.type === parts.DIALOGUE || located.node.type === parts.CAPTION) {
        wordCounts.push({
          count: located.node.wordCount,
          lineNumber: located.lineNumber,
          isSpread: false
        });
      } else if (located.node.type === parts.PANEL || located.node.type === parts.SPREAD) {
        wordCounts.push({
          count: located.node.dialogueWordCount + located.node.captionWordCount,
          lineNumber: located.lineNumber,
          isSpread: located.node.type === parts.SPREAD
        });
      }
    }

    return wordCounts;
  }
));
