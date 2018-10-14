import React from 'react';

import Sfx from '../../components/sfx/Sfx';
import { SFX } from '../rule-ordering';

const matchRegex = /^> ?sfx ?(\([^\n]+\))?: ?([^\n]+)\n*/;

export default {
  order: SFX,
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
  state.startNewLettering();

  // strip parens if modifier is there
  const modifier = capture[1] ? capture[1].slice(1, -1) : undefined;
  const content = capture[2];
  const number = state.letteringNumber;

  return {
    id: state.getLetteringId(),
    modifier,
    content: recurseParse(content, Object.assign({}, state, {inline: true})),
    number
  };
}

function react(node, recurseOutput, state) {
  return React.createElement(
    Sfx,
    {
      children: recurseOutput(node.content, state),
      key: state.key,
      number: node.number,
      modifier: node.modifier
    }
  );
}