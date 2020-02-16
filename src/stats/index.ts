import { ComicChild } from '../parser/types';
import visit from '../parser/visit';
import { SPREAD, PANEL, DIALOGUE, CAPTION } from '../comic-part-types';
import { ComicStats } from './types';

export function extractStats(parseResult: Array<ComicChild>): Array<ComicStats> {
  const stats: Array<ComicStats> = [];
  let panelsSeen = 0;

  visit(parseResult, {
    enterSpread() {
      panelsSeen = 0;
    },
    exitSpread(spread) {
      stats.push({
        type: SPREAD,
        lineNumber: spread.startingLine,
        wordCount: spread.dialogueWordCount + spread.captionWordCount,
        panelCount: panelsSeen,
        speakers: spread.speakers
      });
    },
    enterPanel(panel) {
      panelsSeen += 1;

      stats.push({
        type: PANEL,
        lineNumber: panel.startingLine,
        wordCount: panel.dialogueWordCount + panel.captionWordCount
      });
    },
    enterDialogue(dialogue) {
      stats.push({
        type: DIALOGUE,
        lineNumber: dialogue.startingLine,
        wordCount: dialogue.wordCount
      });
    },
    enterCaption(caption) {
      stats.push({
        type: CAPTION,
        lineNumber: caption.startingLine,
        wordCount: caption.wordCount
      });
    }
  });

  return stats;
}
