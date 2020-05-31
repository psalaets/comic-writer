import { Selector } from 'testcafe';

// Some commonly used testcafe Selectors
// https://devexpress.github.io/testcafe/documentation/test-api/selecting-page-elements/selectors/

/**
 * Panel count by its position among all other panel counts.
 *
 * @param {number} index - Zero-based panel count number
 */
export function panelCount(index) {
  const options = {
    timeout: 100
  };

  return Selector(`.panel-count`, options).nth(index);
}

/**
 * The editor's content editable element.
 *
 * You can type into this element.
 */
export function editorInput() {
  return Selector('[contenteditable="true"]');
}

/**
 * Select lines in the editor.
 *
 * This probably selects multiple elements.
 */
export function editorLines() {
  return Selector('.CodeMirror-line');
}

/**
 * Select the lettering hints popup.
 */
export function letteringHintsPopup() {
  return Selector('.CodeMirror-hints');
}

/**
 * Select an individual hint item.
 *
 * @param {number} index Zero-based index
 */
export function letteringHintsItem(index) {
  return Selector('.CodeMirror-hint').nth(index);
}

/**
 * Select the line with the active lettering snippet.
 */
export function activeLetteringSnippet() {
  return Selector('.lettering-snippet');
}

/**
 * Word count by its position among all other word counts.
 *
 * @param {number} index - Zero-based word count number
 */
export function wordCount(index) {
  const options = {
    timeout: 100
  };

  return Selector('.word-count', options).nth(index);
}
