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
    enterPage(page) {
      panelsSeen = 0;
    },
    exitPage(page) {
      stats.push({
        type: types.PAGE,
        lineNumber: page.startingLine,
        wordCount: page.dialogueWordCount + page.captionWordCount,
        panelCount: panelsSeen,
        speakers: page.speakers
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
