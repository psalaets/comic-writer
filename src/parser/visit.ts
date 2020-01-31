// sends a visitor object through the parse tree that was returned by parse()

import * as parts from '../comic-part-names';
import {
  ComicNode,
  Spread,
  Panel,
  Dialogue,
  Sfx,
  Caption,
  Metadata,
  Paragraph
} from './types';

export default function visit(nodes: Array<ComicNode>, visitor: Visitor) {
  nodes.forEach(node => visitNode(node, visitor));
}

function visitNode(node: ComicNode, visitor: Visitor) {
  switch (node.type) {
    case parts.SPREAD:
      visitSpread(node, visitor);
      break;
    case parts.PANEL:
      visitPanel(node, visitor);
      break;
    case parts.DIALOGUE:
      visitDialogue(node, visitor);
      break;
    case parts.SFX:
      visitSfx(node, visitor);
      break;
    case parts.CAPTION:
      visitCaption(node, visitor);
      break;
    case parts.METADATA:
      visitMetadata(node, visitor);
      break;
    case parts.PARAGRAPH:
      visitParagraph(node, visitor);
      break;
    default:
      // no-op
      break;
  }
}

function visitSpread(spread: Spread, visitor: Visitor) {
  if (visitor.enterSpread) visitor.enterSpread(spread);

  visit(spread.content, visitor);

  if (visitor.exitSpread) visitor.exitSpread(spread);
}

function visitPanel(panel: Panel, visitor: Visitor) {
  if (visitor.enterPanel) visitor.enterPanel(panel);

  visit(panel.content, visitor);

  if (visitor.exitPanel) visitor.exitPanel(panel);
}

function visitDialogue(dialogue: Dialogue, visitor: Visitor) {
  if (visitor.enterDialogue) visitor.enterDialogue(dialogue);
  if (visitor.exitDialogue) visitor.exitDialogue(dialogue);
}

function visitCaption(caption: Caption, visitor: Visitor) {
  if (visitor.enterCaption) visitor.enterCaption(caption);
  if (visitor.exitCaption) visitor.exitCaption(caption);
}

function visitSfx(sfx: Sfx, visitor: Visitor) {
  if (visitor.enterSfx) visitor.enterSfx(sfx);
  if (visitor.exitSfx) visitor.exitSfx(sfx);
}

function visitMetadata(metadata: Metadata, visitor: Visitor) {
  if (visitor.enterMetadata) visitor.enterMetadata(metadata);
  if (visitor.exitMetadata) visitor.exitMetadata(metadata);
}

function visitParagraph(paragraph: Paragraph, visitor: Visitor) {
  if (visitor.enterParagraph) visitor.enterParagraph(paragraph);
  if (visitor.exitParagraph) visitor.exitParagraph(paragraph);
}

interface Visitor {
  enterSpread?: (spread: Spread) => void,
  exitSpread?: (spread: Spread) => void,

  enterPanel?: (panel: Panel) => void,
  exitPanel?: (panel: Panel) => void,

  enterDialogue?: (dialogue: Dialogue) => void,
  exitDialogue?: (dialogue: Dialogue) => void,

  enterCaption?: (caption: Caption) => void,
  exitCaption?: (caption: Caption) => void,

  enterSfx?: (sfx: Sfx) => void,
  exitSfx?: (sfx: Sfx) => void,

  enterMetadata?: (metadata: Metadata) => void,
  exitMetadata?: (metadata: Metadata) => void,

  enterParagraph?: (paragraph: Paragraph) => void,
  exitParagraph?: (paragraph: Paragraph) => void,
}
