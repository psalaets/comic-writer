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
