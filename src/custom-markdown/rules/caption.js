import React from 'react';
import SimpleMarkdown from 'simple-markdown';

import Caption from '../../components/caption/Caption';

const matchRegex = /^> ?caption ?(\([^\n]+\))?: ([^\n]+)/;

export default {
  order: SimpleMarkdown.defaultRules.blockQuote.order - 0.3,
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
  // strip parens if modifier is there
  const modifier = capture[1] ? capture[1].slice(1, -1) : undefined;
  const content = capture[2];
  const number = state.letteringNumber++;

  return {
    modifier,
    content: recurseParse(content, Object.assign({}, state, {inline: true})),
    number
  };
}

function react(node, recurseOutput, state) {
  return React.createElement(
    Caption,
    {
      children: recurseOutput(node.content, state),
      key: state.key,
      number: parseInt(node.number, 10),
      modifier: node.modifier
    }
  );
}
