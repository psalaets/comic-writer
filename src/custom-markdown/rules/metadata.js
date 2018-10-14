import React from 'react';

import { METADATA } from '../rule-ordering';

const matchRegex = /^([^\n]*): ?([^\n]+)\n*/;

export default {
  order: METADATA,
  match,
  parse,
  react
};

function match(source, state, lookbehind) {
  if (state.inline) {
    return null;
  } else {
    return matchRegex.exec(source);
  }
}

function parse(capture, recurseParse, state) {
  const [, key, value] = capture;

  return {
    key,
    value
  };
}

function react(node, recurseOutput, state) {
  return React.createElement(
    'div',
    {
      children: `key: ${node.key}, value: ${node.value}`,
      key: state.key,
      className: 'metadata'
    }
  );
}