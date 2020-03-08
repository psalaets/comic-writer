import { EditorChange } from 'codemirror';

export default applyChange;

function applyChange(lines: Array<string>, change: EditorChange): Array<string> {
  const copy = lines.slice();

  const { from, to } = change;
  const linesAffected = (to.line - from.line) + 1;
  const fromLineText = copy[from.line];
  const toLineText = copy[to.line];

  const replacements = change.text
    .map((replacement, index, array) => {
      if (index === 0) {
        replacement = fromLineText.slice(0, from.ch) + replacement;
      }

      if (index === array.length - 1) {
        replacement = replacement + toLineText.slice(to.ch);
      }

      return replacement;
    });

  copy.splice(from.line, linesAffected, ...replacements);

  return copy;
}
