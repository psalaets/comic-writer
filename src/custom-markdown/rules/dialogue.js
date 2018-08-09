import React from 'react';
import SimpleMarkdown from 'simple-markdown';

import Dialogue from '../../components/dialogue/Dialogue';

const matchRegex = /^> ?([^\n]+?) ?(\([^\n]+\))?: ([^\n]+)/;

export default {
  order: SimpleMarkdown.defaultRules.blockQuote.order - 0.1,
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
  const speaker = capture[1];
  // strip parens if modifier is there
  const modifier = capture[2] ? capture[2].slice(1, -1) : undefined;
  const content = capture[3];
  const number = state.letteringNumber++;

  return {
    speaker,
    modifier,
    content: recurseParse(content, Object.assign({}, state, {inline: true})),
    number
  };
}

function react(node, recurseOutput, state) {
  return React.createElement(
    Dialogue,
    {
      children: recurseOutput(node.content, state),
      key: state.key,
      speaker: node.speaker,
      number: node.number,
      modifier: node.modifier
    }
  );
}