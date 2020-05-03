import { Selector } from 'testcafe';

// Some commonly used testcafe Selectors
// https://devexpress.github.io/testcafe/documentation/test-api/selecting-page-elements/selectors/

/**
 * Panel count for a given line.
 *
 * @param {number} lineNumber - Zero based
 */
export function panelCount(lineNumber) {
  return Selector(`.panel-count[data-line="${lineNumber}"]`);
}

/**
 * The editor's content editable element.
 *
 * You can type into this element.
 */
export function editorContent() {
  return Selector('[contenteditable="true"]');
}

/**
 * Select lines in the editor.
 *
 * This probably selects multiple elements.
 */
export function editorLine() {
  return Selector('.CodeMirror-line');
}
