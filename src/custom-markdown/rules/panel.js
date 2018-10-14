import React from 'react';

import Panel from '../../components/panel/Panel';
import { PANEL } from '../rule-ordering';

const panelRegex = /^### Panel (\d{1,})\n*([^]*)\n*/;
const PANEL_PREFIX = '### Panel';

export default {
  order: PANEL,
  match,
  parse,
  react
};

function match(source, state, lookbehind) {
  if (state.inline) {
    return null
  } else {
    const index = source.indexOf(PANEL_PREFIX);

    if (index !== 0) {
      return null;
    }

    const nextIndex = source.indexOf(PANEL_PREFIX, index + PANEL_PREFIX.length);
    const panel = nextIndex === -1 ? source : source.slice(0, nextIndex);
    const capture = panelRegex.exec(panel);

    const number = capture[1];
    const content = capture[2];

    return [panel, number, content];
  }
}

function parse(capture, recurseParse, state) {
  state.startNewPanel();

  const number = Number(capture[1]);
  const content = capture[2];

  const contentParseTree = recurseParse(content, state);
  const dialogues = contentParseTree.filter(node => node.type === 'dialogue');
  const captions = contentParseTree.filter(node => node.type === 'caption');
  const sfxs = contentParseTree.filter(node => node.type === 'sfx');

  return {
    id: state.getPanelId(),
    number,
    content: contentParseTree,
    dialogueCount: dialogues.length,
    captionCount: captions.length,
    sfxCount: sfxs.length,
    dialogueWords: dialogues.reduce((total, d) => total + d.wordCount, 0),
    captionWords: captions.reduce((total, c) => total + c.wordCount, 0)
  };
}

function react(node, recurseOutput, state) {
  return React.createElement(
    Panel,
    {
      key: state.key,
      number: parseInt(node.number, 10)
    },
    recurseOutput(node.content, state)
  );
}
