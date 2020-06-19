import fs from 'fs';
import path from 'path';
import { ClientFunction } from 'testcafe';
import * as selectors from './selectors';

/**
 * Get all lines from the editor.
 */
export async function editorLines() {
  const lineElements = selectors.editorLines();
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

export const getSelectedText = ClientFunction(() => {
  return window.getSelection().toString();
});

const LETTERING_INDENT = ' '.repeat(8);
export function lettering(lineAfterIndent) {
  return `${LETTERING_INDENT}${lineAfterIndent}`;
}

export async function preloadBitchPlanetScript() {
  const script = await loadScriptContent('bitch-planet-3.txt');
  await setLocalStorageScript(script);
}

function loadScriptContent(filename) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(__dirname, '../sample-scripts', filename);
    fs.readFile(absolutePath, (err, buffer) => {
      return err
        ? reject(err)
        : resolve(buffer.toString('utf8'));
    });
  });
}

async function setLocalStorageScript(script) {
  await ClientFunction(() => {
    localStorage.setItem('comic-writer.script', json);
  }, {
    dependencies: {
      json: JSON.stringify(script)
    }
  })();
}
