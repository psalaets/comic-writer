import React from "react";

import Metadata from "../../components/metadata/Metadata";
import { METADATA } from "../rule-ordering";

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
  return React.createElement(Metadata, {
    key: state.key,
    type: node.key,
    children: node.value,
    className: "metadata"
  });
}
