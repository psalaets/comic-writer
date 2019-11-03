import React from 'react';
import { Text } from '@react-pdf/renderer';

import * as types from '../../types';

import Spread from './Spread';
import FrontPage from './FrontPage';
import Panel from './Panel';
import Dialogue from './Dialogue';
import Caption from './Caption';
import Sfx from './Sfx';
import Paragraph from './Paragraph';

export function renderScriptPages(content) {
  const frontPageCount = countFrontPageContent(content);

  return [
    renderFrontPage(content.slice(0, frontPageCount)),
    ...renderNodes(content.slice(frontPageCount))
  ];
}

function countFrontPageContent(content) {
  let index = 0;

  while (content.length > 0 && content[index].type !== types.SPREAD) {
    index += 1;
  }

  return index;
}

function renderFrontPage(content) {
  return <FrontPage key="frontpage" content={content} />;
}

export function renderNodes(content) {
  return content.map(renderNode);
}

function renderNode(node) {
  switch (node.type) {
    case types.SPREAD:
      return (
        <Spread
          key={node.id}
          label={node.label}
          pageCount={node.pageCount}
          panelCount={node.panelCount}
          content={node.content}
        />
      );
    case types.PANEL:
      return (
        <Panel
          key={node.id}
          number={node.number}
          content={node.content}
        />
      );
    case types.DIALOGUE:
      return (
        <Dialogue
          key={node.id}
          number={node.number}
          speaker={node.speaker}
          modifier={node.modifier}
          content={node.content}
        />
      );
    case types.CAPTION:
      return (
        <Caption
          key={node.id}
          number={node.number}
          modifier={node.modifier}
          content={node.content}
        />
      );
    case types.SFX:
      return (
        <Sfx
          key={node.id}
          number={node.number}
          modifier={node.modifier}
          content={node.content}
        />
      );
    case types.PARAGRAPH:
      return (
        <Paragraph
          key={node.id}
          content={node.content}
        />
      );
    default:
      return <Text key={node.id}>Unhandled node type: "{node.type}"</Text>;
  }
}
