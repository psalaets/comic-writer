import { Selector } from 'testcafe';

export async function editorLines() {
  const lineElements = Selector('.CodeMirror-line')
  const count = await lineElements.count;

  const lines = [];

  for (let i = 0; i < count; i++) {
    lines.push(await lineElements.nth(i).textContent);
  }

  return lines
    // CodeMirror uses zero-width space to represent blank lines.
    // Convert those into empty strings so assertions will be simpler.
    .map(line => line.replace(/\u{200B}/u, ''));
}

export function panelCountSelector(lineNumber) {
  return Selector(`.panel-count[data-line="${lineNumber}"]`);
}

/**
 * Select a line in the editor. Warning: this doesn't handle virtual rendered
 * lines.
 *
 * @param {number} lineNumber - Zero based line number
 */
export function editorLineSelector(lineNumber) {
  return Selector('.CodeMirror-line')
    .nth(lineNumber)
    // .find('span[role="presentation"]')
}
