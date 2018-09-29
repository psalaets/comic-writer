import visit from '../../custom-markdown/visit';

export default function extractStats(parseTree) {
  const stats = {};

  visit(parseTree, {
    exitPage(page) {
      const {
        panelCount,
        dialogueCount,
        captionCount,
        sfxCount,
        dialogueWords,
        captionWords,
      } = page;

      stats[page.id] = {
        panelCount,
        dialogueCount,
        captionCount,
        sfxCount,
        dialogueWords,
        captionWords,
      };
    },
    exitPanel(panel) {
      const {
        dialogueCount,
        captionCount,
        sfxCount,
        dialogueWords,
        captionWords,
      } = panel;

      stats[panel.id] = {
        dialogueCount,
        captionCount,
        sfxCount,
        dialogueWords,
        captionWords,
      };
    },
    exitLettering(lettering) {
      stats[lettering.id] = {
        wordCount: lettering.wordCount || 0
      };
    }
  });

  return stats;
}