import React from 'react';
import SimpleMarkdown from 'simple-markdown';

import Panel from '../../components/panel/Panel';

const panelRegex = /^### Panel (\d{1,})([^]*)/;
const PANEL_PREFIX = '### Panel';

export default {
  order: SimpleMarkdown.defaultRules.heading.order - 0.1,
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
  const number = capture[1];
  const content = capture[2];

  return {
    content: recurseParse(content, state),
    number
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
