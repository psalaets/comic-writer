import fs from 'fs';
import path from 'path';

import { ClientFunction } from 'testcafe';
import { Selector } from 'testcafe';
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
  await reloadPage();
}

export async function preloadEvenSpacingScript() {
  const script = await loadScriptContent('even-spacing.txt');
  await setLocalStorageScript(script);
  await reloadPage();
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

export async function reloadPage() {
  return await ClientFunction(() => location.reload(true))();
}

export async function scrollEditorBy(yDelta) {
  return await ClientFunction(() => {
    document.querySelector('.CodeMirror-scroll').scrollBy(0, yDelta);
  }, {
    dependencies: {
      yDelta
    }
  })();
}

export async function isItemVisibleInOutline(itemSelector) {
  const outlineState = await Selector('.c-outline')();
  const {
    top: outlineTop,
    bottom: outlineBottom
  } = outlineState.boundingClientRect;

  const itemState = await itemSelector();
  const {
    top: itemTop,
    bottom: itemBottom
  } = itemState.boundingClientRect;

  return itemBottom <= outlineBottom && itemTop >= outlineTop;
}

// Useful for sanity checking window size in the test env
// https://testcafe-discuss.devexpress.com/t/setting-the-browser-window-size-on-mac-os-x/170/6
export async function getSizeInfo() {
  return await ClientFunction(() => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      availableWidth: screen.availWidth,
      availableHeight: screen.availHeight
    };
  });
}
