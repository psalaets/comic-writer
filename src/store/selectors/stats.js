import { createSelector } from 'reselect';

import visit from '../../parser/visit';
import * as types from '../../types';
import { parseResultSelector } from './parse-result';

export const statsSelector = createSelector(
  parseResultSelector,
  parseResult => extractStats(parseResult)
);

function extractStats(parseResult) {
  const stats = [];
  let panelsSeen = 0;

  visit(parseResult, {
    enterSpread() {
      panelsSeen = 0;
    },
    exitSpread(spread) {
      stats.push({
        type: types.SPREAD,
        lineNumber: spread.startingLine,
        wordCount: spread.dialogueWordCount + spread.captionWordCount,
        panelCount: panelsSeen,
        speakers: spread.speakers
      });
    },
    enterPanel(panel) {
      panelsSeen += 1;

      stats.push({
        type: types.PANEL,
        lineNumber: panel.startingLine,
        wordCount: panel.dialogueWordCount + panel.captionWordCount
      });
    },
    enterDialogue(dialogue) {
      stats.push({
        type: types.DIALOGUE,
        lineNumber: dialogue.startingLine,
        wordCount: dialogue.wordCount
      });
    },
    enterCaption(caption) {
      stats.push({
        type: types.CAPTION,
        lineNumber: caption.startingLine,
        wordCount: caption.wordCount
      });
    }
  });

  return stats;
}
