import React from 'react';

import countWords from '../count-words';
import Dialogue from '../../components/dialogue/Dialogue';
import { DIALOGUE } from '../rule-ordering';

const matchRegex = /^> ?([^\n]+?) ?(\([^\n]+\))?: ?([^\n]+)\n*/;

export default {
  order: DIALOGUE,
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

  const speaker = capture[1];
  // strip parens if modifier is there
  const modifier = capture[2] ? capture[2].slice(1, -1) : undefined;
  const content = capture[3];
  const number = state.letteringNumber;

  const parseTree = recurseParse(content, Object.assign({}, state, {
    inline: true,
    inLettering: true
  }));

  state.inLettering = false;

  return {
    id: state.getLetteringId(),
    speaker,
    modifier,
    content: parseTree,
    number,
    wordCount: countWords(parseTree)
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