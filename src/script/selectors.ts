import { createSelector } from 'reselect';

import { Script, ComicNode } from '../parser/types';
import { parseLines } from '../parser';

import { wrap } from '../perf';

import { RootState } from '../store/types';
import { ScriptState, PanelCount, WordCount, SpreadChunk, LocatedComicNode } from './types';
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

function selectSpreadChunks(state: RootState): Array<SpreadChunk> {
  return selectScriptState(state).spreads;
}

export const selectNodesBySpread = createSelector(
  selectSpreadChunks,
  spreads => spreads.map(spread => parseLines(spread.lines))
);

export const selectPreSpreadNodes = createSelector(
  selectPreSpreadLines,
  preSpreadLines => parseLines(preSpreadLines)
)

const selectPreSpreadLineCount = createSelector(
  selectPreSpreadLines,
  lines => lines.length
);

export const selectLocatedPreSpreadNodes = createSelector(
  selectPreSpreadNodes,
  (nodes): Array<LocatedComicNode> => {
    return nodes.map((node, lineNumber) => ({node, lineNumber}));
  }
);

export const selectLocatedNodesBySpread = createSelector(
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

export const selectSpreadRollups = createSelector(
  [selectLocatedPreSpreadNodes, selectLocatedNodesBySpread],
  (preSpreadNodes, nodesBySpread) => {
    const spreads: any = {};
    let currentSpread = {
      lineNumber: 0,
      panelCount: 0,
      speakers: [] as Array<string>,
      dialogueCount: 0,
      captionCount: 0,
      sfxCount: 0,
      dialogueWordCount: 0,
      captionWordCount: 0
    };

    for (const located of iterator(preSpreadNodes, nodesBySpread)) {
      switch (located.node.type) {
        case parts.SPREAD: {
          spreads[located.lineNumber] = currentSpread = {
            lineNumber: located.lineNumber,
            panelCount: 0,
            speakers: [],
            dialogueCount: 0,
            captionCount: 0,
            sfxCount: 0,
            dialogueWordCount: 0,
            captionWordCount: 0
          };
          break;
        }
        case parts.CAPTION: {
          currentSpread.captionCount += 1;
          currentSpread.captionWordCount += located.node.wordCount;
          break;
        }
        case parts.DIALOGUE: {
          currentSpread.dialogueCount += 1;
          currentSpread.dialogueWordCount += located.node.wordCount;
          currentSpread.speakers.push(located.node.speaker);
          break;
        }
        case parts.SFX: {
          currentSpread.sfxCount += 1;
          break;
        }
        case parts.PANEL: {
          currentSpread.panelCount += 1;
          break;
        }
      }
    }

    return spreads;
  }
)

/*
export const selectSpeakers = wrap('selectSpeakers', createSelector(
  selectParseResult,
  parseResult => {
    const allSpeakers = [] as Array<string>;

    visit(parseResult, {
      enterSpread(spread) {
        allSpeakers.push(...spread.speakers);
      }
    });

    return dedupe(allSpeakers).sort();
  }
));

function dedupe(speakers: Array<string>): Array<string> {
  const allCaps = speakers.map(speaker => speaker.toLocaleUpperCase());
  return [...new Set(allCaps)];
}

/*
export const selectPanelCounts = wrap('selectPanelCounts', createSelector(
  selectParseResult,
  parseResult => {
    const spreadsWithPanels = [] as Array<PanelCount>;

    let panelsSeen = 0;

    visit(parseResult, {
      exitSpread(spread) {
        spreadsWithPanels.push({
          lineNumber: spread.startingLine,
          count: panelsSeen
        });

        panelsSeen = 0;
      },
      enterPanel(panel) {
        panelsSeen += 1;
      }
    });

    return spreadsWithPanels;
  }
));

export const selectWordCounts = wrap('selectWordCounts', createSelector(
  selectParseResult,
  parseResult => {
    const wordCounts: Array<WordCount> = [];

    visit(parseResult, {
      exitSpread(spread) {
        wordCounts.push({
          nodeId: spread.id,
          count: spread.captionWordCount + spread.dialogueWordCount,
          lineNumber: spread.startingLine,
          isSpread: true
        });
      },
      exitPanel(panel) {
        wordCounts.push({
          nodeId: panel.id,
          count: panel.captionWordCount + panel.dialogueWordCount,
          lineNumber: panel.startingLine,
          isSpread: false
        });
      },
      exitCaption(caption) {
        wordCounts.push({
          nodeId: caption.id,
          count: caption.wordCount,
          lineNumber: caption.startingLine,
          isSpread: false
        });
      },
      exitDialogue(dialogue) {
        wordCounts.push({
          nodeId: dialogue.id,
          count: dialogue.wordCount,
          lineNumber: dialogue.startingLine,
          isSpread: false
        });
      }
    });

    return wordCounts;
  }
));
*/
