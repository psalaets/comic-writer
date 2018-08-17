import React from 'react';
import SimpleMarkdown from 'simple-markdown';

import LetteringBold from '../../components/lettering-bold/LetteringBold';

const matchRegex = /^\*\*([^\n]+)\*\*/;

export default {
  order: SimpleMarkdown.defaultRules.strong.order - 0.1,
  match,
  parse,
  react
};

function match(source, state, lookbehind) {
  if (state.inline && state.inLettering) {
    return matchRegex.exec(source);
  } else {
    return null;
  }
}

function parse(capture, recurseParse, state) {
  const content = capture[1];

  return {
    content: recurseParse(content, state)
  };
}

function react(node, recurseOutput, state) {
  return React.createElement(
    LetteringBold,
    {
      children: recurseOutput(node.content, state),
      key: state.key
    }
  );
}