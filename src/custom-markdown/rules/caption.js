import React from 'react';
import SimpleMarkdown from 'simple-markdown';

import countWords from '../count-words';
import Caption from '../../components/caption/Caption';

const matchRegex = /^> ?caption ?(\([^\n]+\))?: ?([^\n]+)\n*/;

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
  state.startNewLettering();

  // strip parens if modifier is there
  const modifier = capture[1] ? capture[1].slice(1, -1) : undefined;
  const content = capture[2];
  const number = state.letteringNumber;

  const parseTree = recurseParse(content, Object.assign({}, state, {
    inline: true,
    inLettering: true
  }));

  state.inLettering = false;

  return {
    id: state.getLetteringId(),
    modifier,
    content: parseTree,
    number,
    wordCount: countWords(parseTree)
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
