import { createSelector } from 'reselect';

import { ComicNode } from '../parser/types';
import { parseSpread, parsePreSpread, visit } from '../parser';

import { wrap } from '../perf';

import { RootState } from '../store/types';
import { ScriptState, PanelCount, WordCount, SpreadContent } from './types';

function selectScriptState(state: RootState): ScriptState {
  return state.script;
}

export function selectSource(state: RootState): string {
  return selectScriptState(state).source;
}

function selectPreSpreadLines(state: RootState): Array<string> {
  return selectScriptState(state).preSpread;
}

function selectSpreadLines(state: RootState): Array<SpreadContent> {
  return selectScriptState(state).spreads;
}

const selectSpreadNodes = createSelector(
  selectSpreadLines,
  spreadLines => spreadLines.map(spread => parseSpread(spread.lines))
);

const selectPreSpreadNodes = createSelector(
  selectPreSpreadLines,
  preSpreadLines => parsePreSpread(preSpreadLines)
)

export const selectParseResult = wrap('selectParseResult', createSelector(
  [selectPreSpreadNodes, selectSpreadNodes],
  (preSpreadNodes, spreads) => {
    return [
      ...preSpreadNodes,
      ...spreads
    ] as Array<ComicNode>;
  }
));
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
