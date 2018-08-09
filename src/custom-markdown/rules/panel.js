import React from 'react';
import SimpleMarkdown from 'simple-markdown';

import Panel from '../../components/panel/Panel';

const matchRegex = /^### (Panel (\d{1,}))/;

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
    return matchRegex.exec(source);
  }
}

function parse(capture, recurseParse, state) {
  const content = capture[1];
  const number = capture[2];

  return {
    content,
    number
  };
}

function react(node, recurseOutput, state) {
  return React.createElement(
    Panel,
    {
      key: state.key
    },
    node.content
  );
}