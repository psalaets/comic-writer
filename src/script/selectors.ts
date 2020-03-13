import { createSelector } from 'reselect';

import parse from '../parser';
import visit from '../parser/visit';

import { RootState } from '../store/types';
import { ScriptState, PanelCount, WordCount } from './types';

const selectScriptState = (state: RootState): ScriptState => state.script;

export const selectSource = createSelector(
  selectScriptState,
  script => script.source
);

export const selectParseResult = createSelector(
  selectSource,
  source => parse(source)
);

export const selectSpeakers = createSelector(
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
);

function dedupe(speakers: Array<string>): Array<string> {
  const allCaps = speakers.map(speaker => speaker.toLocaleUpperCase());
  return [...new Set(allCaps)];
}

export const selectPanelCounts = createSelector(
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
);

export const selectWordCounts = createSelector(
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
);
