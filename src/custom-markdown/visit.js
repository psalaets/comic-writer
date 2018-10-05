// sends a visitor object through the parse tree that was returned by parse()

export default function visit(nodes, visitor) {
  nodes.forEach(node => visitNode(node, visitor));
}
function visitNode(node, visitor) {
  if (node.type === 'page') {
    visitPage(node, visitor);
  } else if (node.type === 'panel') {
    visitPanel(node, visitor);
  } else if (node.type === 'dialogue') {
    visitDialogue(node, visitor);
  } else if (node.type === 'caption') {
    visitCaption(node, visitor);
  } else if (node.type === 'sfx') {
    visitSfx(node, visitor);
  }
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
  if (visitor.enterLettering) visitor.enterLettering(dialogue);

  if (visitor.enterDialogue) visitor.enterDialogue(dialogue);
  if (visitor.exitDialogue) visitor.exitDialogue(dialogue);

  if (visitor.exitLettering) visitor.exitLettering(dialogue);
}

function visitCaption(caption, visitor) {
  if (visitor.enterLettering) visitor.enterLettering(caption);

  if (visitor.enterCaption) visitor.enterCaption(caption);
  if (visitor.exitCaption) visitor.exitCaption(caption);

  if (visitor.exitLettering) visitor.exitLettering(caption);
}

function visitSfx(sfx, visitor) {
  if (visitor.enterLettering) visitor.enterLettering(sfx);

  if (visitor.enterSfx) visitor.enterSfx(sfx);
  if (visitor.exitSfx) visitor.exitSfx(sfx);

  if (visitor.exitLettering) visitor.exitLettering(sfx);
}
