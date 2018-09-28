import React from 'react';
import SimpleMarkdown from 'simple-markdown';

import Page from '../../components/page/Page';

const pageRegex = /^## Page (\d{1,})\n*([^]*)\n*/;
const PAGE_PREFIX = '## Page';

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
    const index = source.indexOf(PAGE_PREFIX);

    if (index !== 0) {
      return null;
    }

    const nextIndex = source.indexOf(PAGE_PREFIX, index + PAGE_PREFIX.length);
    const page = nextIndex === -1 ? source : source.slice(0, nextIndex);
    const capture = pageRegex.exec(page);

    const number = capture[1];
    const content = capture[2];

    return [page, number, content];
  }
}

function parse(capture, recurseParse, state) {
  const number = Number(capture[1]);
  const content = capture[2];

  state.startNewPage();

  return {
    id: state.getPageId(),
    content: recurseParse(content, state),
    number
  };
}

function react(node, recurseOutput, state) {
  const panelCount = node.content
    .filter(chunk => chunk.type === 'panel')
    .length;

  return React.createElement(
    Page,
    {
      key: state.key,
      panelCount,
      number: parseInt(node.number, 10)
    },
    recurseOutput(node.content, state)
  );
}
