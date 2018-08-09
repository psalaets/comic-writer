// The custom markdown parser/outputer that we use

import React from 'react';
import SimpleMarkdown from 'simple-markdown';

import dialogueRule from './rules/dialogue';
import pageRule from './rules/page';
import panelRule from './rules/panel';
import sfxRule from './rules/sfx';
import captionRule from './rules/caption';

const rules = {
  ...SimpleMarkdown.defaultRules,
  page: pageRule,
  panel: panelRule,
  dialogue: dialogueRule,
  sfx: sfxRule,
  caption: captionRule
};

const rawBuiltParser = SimpleMarkdown.parserFor(rules);
export function parse(source) {
  const blockSource = source + "\n\n";
  return rawBuiltParser(blockSource, { inline: false });
};

export const reactOutput = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, 'react'));