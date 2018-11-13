import React from 'react';
import * as types from '../parser/types';

import Page from './page/Page';
import Panel from './panel/Panel';
import Dialogue from './dialogue/Dialogue';
import Caption from './caption/Caption';
import Sfx from './sfx/Sfx';
import Metadata from './metadata/Metadata';
import Paragraph from './paragraph/Paragraph';

export function renderNodes(content) {
  return content.map(renderNode);
}

function renderNode(node) {
  switch (node.type) {
    case types.PAGE:
      return (
        <Page
          key={node.id}
          number={node.number}
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
    case types.METADATA:
      return (
        <Metadata
          key={node.id}
          name={node.name}
          value={node.value}
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
      return <div>Unhandled node type: "{node.type}"</div>;
  }
}