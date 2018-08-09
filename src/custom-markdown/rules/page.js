import React from 'react';
import SimpleMarkdown from 'simple-markdown';

import Page from '../../components/page/Page';

const matchRegex = /^## (Page (\d{1,}))/;

export default {
  order: SimpleMarkdown.defaultRules.heading.order - 0.2,
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

  state.letteringNumber = 1;

  return {
    content,
    number
  };
}

function react(node, recurseOutput, state) {
  return React.createElement(
    Page,
    {
      key: state.key
    },
    node.content
  );
}