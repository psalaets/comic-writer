// sends a visitor object through the parse tree that was returned by parse()

import * as types from '../types';

export default function visit(nodes, visitor) {
  nodes.forEach(node => visitNode(node, visitor));
}

function visitNode(node, visitor) {
  switch (node.type) {
    case types.SPREAD:
      visitSpread(node, visitor);
      break;
    case types.PAGE:
      visitPage(node, visitor);
      break;
    case types.PANEL:
      visitPanel(node, visitor);
      break;
    case types.DIALOGUE:
      visitDialogue(node, visitor);
      break;
    case types.SFX:
      visitSfx(node, visitor);
      break;
    case types.CAPTION:
      visitCaption(node, visitor);
      break;
    case types.METADATA:
      visitMetadata(node, visitor);
      break;
    case types.PARAGRAPH:
      visitParagraph(node, visitor);
      break;
    default:
      // no-op
      break;
  }
}

function visitSpread(spread, visitor) {
  if (visitor.enterSpread) visitor.enterSpread(spread);

  visit(spread.content, visitor);

  if (visitor.exitSpread) visitor.exitSpread(spread);
}

function visitPage(page, visitor) {
  if (visitor.enterPage) visitor.enterPage(page);

  visit(page.content, visitor);

  if (visitor.exitPage) visitor.exitPage(page);
}

function visitPanel(panel, visitor) {
  if (visitor.enterPanel) visitor.enterPanel(panel);

  visit(panel.content, visitor);

  if (visitor.exitPanel) visitor.exitPanel(panel);
}

function visitDialogue(dialogue, visitor) {
  if (visitor.enterDialogue) visitor.enterDialogue(dialogue);
  if (visitor.exitDialogue) visitor.exitDialogue(dialogue);
}

function visitCaption(caption, visitor) {
  if (visitor.enterCaption) visitor.enterCaption(caption);
  if (visitor.exitCaption) visitor.exitCaption(caption);
}

function visitSfx(sfx, visitor) {
  if (visitor.enterSfx) visitor.enterSfx(sfx);
  if (visitor.exitSfx) visitor.exitSfx(sfx);
}

function visitMetadata(metadata, visitor) {
  if (visitor.enterMetadata) visitor.enterMetadata(metadata);
  if (visitor.exitMetadata) visitor.exitMetadata(metadata);
}

function visitParagraph(paragraph, visitor) {
  if (visitor.enterParagraph) visitor.enterParagraph(paragraph);
  if (visitor.exitParagraph) visitor.exitParagraph(paragraph);
}