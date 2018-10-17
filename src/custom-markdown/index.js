// The custom markdown parser/outputer that we use

import SimpleMarkdown from 'simple-markdown';

import dialogueRule from './rules/dialogue';
import pageRule from './rules/page';
import panelRule from './rules/panel';
import sfxRule from './rules/sfx';
import captionRule from './rules/caption';
import letteringBoldRule from './rules/lettering-bold';
import metadataRule from './rules/metadata';
import paragraphRule from './rules/paragraph';

const rules = {
  ...SimpleMarkdown.defaultRules,
  metadata: metadataRule,
  page: pageRule,
  panel: panelRule,
  dialogue: dialogueRule,
  sfx: sfxRule,
  caption: captionRule,
  letteringBold: letteringBoldRule,
  paragraph: paragraphRule
};

const rawBuiltParser = SimpleMarkdown.parserFor(rules);

export function parse(source) {
  const blockSource = source;
  return rawBuiltParser(blockSource, {
    inline: false,
    letteringNumber: 0,
    pageNumber: 0,
    panelNumber: 0,
    startNewPage() {
      this.pageNumber += 1;
      this.panelNumber = 0;
      this.letteringNumber = 0;
    },
    startNewPanel() {
      this.panelNumber += 1;
    },
    startNewLettering() {
      this.letteringNumber += 1;
    },
    getPageId() {
      return String(this.pageNumber);
    },
    getPanelId() {
      return `${this.getPageId()}.${this.panelNumber}`;
    },
    getLetteringId() {
      return `${this.getPanelId()}.${this.letteringNumber}`;
    }
  });
};

export const reactOutput = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, 'react'));
