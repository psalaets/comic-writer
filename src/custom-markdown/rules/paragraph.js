import React from 'react';

import { PARAGRAPH } from '../rule-ordering';

const prefixes = `### P|## P|> `;
// paragraph ends with 2 newlines or page or panel or lettering
const regex = RegExp(`^([^]+?)(?=\n\n|${prefixes})`);

export default {
  order: PARAGRAPH,
  match,
  parse,
  react
};

function match(source, state, lookbehind) {
  if (state.inline) {
    return null
  } else {
    return regex.exec(source);
  }
}

function parse(capture, recurseParse, state) {
  const content = capture[1];
  const contentParseTree = recurseParse(content, state);

  return {
    content: contentParseTree
  };
}

function react(node, recurseOutput, state) {
  return React.createElement(
    'div',
    {
      key: state.key,
      className: 'paragraph'
    },
    recurseOutput(node.content, state)
  );
}
