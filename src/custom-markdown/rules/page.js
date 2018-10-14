import React from 'react';

import Page from '../../components/page/Page';
import { PAGE } from '../rule-ordering';

const pageRegex = /^## Page (\d{1,})\n*([^]*)\n*/;
const PAGE_PREFIX = '## Page';

export default {
  order: PAGE,
  match,
  parse,
  react
};

function match(source, state, lookbehind) {
  if (state.inline) {
    return null
  } else {
    const index = source.indexOf(PAGE_PREFIX);

    if (index !== 0) {
      return null;
    }

    const nextIndex = source.indexOf(PAGE_PREFIX, index + PAGE_PREFIX.length);
    const page = nextIndex === -1 ? source : source.slice(0, nextIndex);
    const capture = pageRegex.exec(page);

    const number = capture[1];
    const content = capture[2];

    return [page, number, content];
  }
}

function parse(capture, recurseParse, state) {
  const number = Number(capture[1]);
  const content = capture[2];

  state.startNewPage();

  const contentParseTree = recurseParse(content, state);
  const panels = contentParseTree.filter(node => node.type === 'panel');

  return {
    id: state.getPageId(),
    number,
    content: contentParseTree,
    panelCount: panels.length,
    dialogueCount: panels.reduce((total, p) => p.dialogueCount, 0),
    captionCount: panels.reduce((total, p) => p.captionCount, 0),
    sfxCount: panels.reduce((total, p) => p.sfxCount, 0),
    dialogueWords: panels.reduce((total, p) => p.dialogueWords, 0),
    captionWords: panels.reduce((total, p) => p.captionWords, 0)
  };
}

function react(node, recurseOutput, state) {
  return React.createElement(
    Page,
    {
      key: state.key,
      panelCount: node.panelCount,
      number: node.number
    },
    recurseOutput(node.content, state)
  );
}
