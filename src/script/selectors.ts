import { createSelector } from 'reselect';

import parse from '../parser';
import visit from '../parser/visit';

import { RootState } from '../store/types';
import { ScriptState, PanelCount, WordCount } from './types';

const getState = (state: RootState): ScriptState => state.script;

export const getSource = createSelector(
  getState,
  script => script.source
);

export const getParseResult = createSelector(
  getSource,
  source => parse(source)
);

export const getSpeakers = createSelector(
  getParseResult,
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

export const getPanelCounts = createSelector(
  getParseResult,
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

export const getWordCounts = createSelector(
  getParseResult,
  parseResult => {
    const wordCounts = [] as Array<WordCount>;

    visit(parseResult, {
      exitSpread(spread) {
        wordCounts.push({
          count: spread.captionWordCount + spread.dialogueWordCount,
          lineNumber: spread.startingLine,
          isSpread: true
        });
      },
      exitPanel(panel) {
        wordCounts.push({
          count: panel.captionWordCount + panel.dialogueWordCount,
          lineNumber: panel.startingLine,
          isSpread: false
        });
      },
      exitCaption(caption) {
        wordCounts.push({
          count: caption.wordCount,
          lineNumber: caption.startingLine,
          isSpread: false
        });
      },
      exitDialogue(dialogue) {
        wordCounts.push({
          count: dialogue.wordCount,
          lineNumber: dialogue.startingLine,
          isSpread: false
        });
      }
    });

    return wordCounts;
  }
);
