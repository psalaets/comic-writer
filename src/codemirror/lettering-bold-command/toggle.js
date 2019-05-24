import transformTokens from './transform-tokens';

export function toggle(tokens, selectionStart, selectionEnd) {
  if (tokens.length === 0) {
    return transformNoTokens(selectionStart.ch, selectionEnd.ch);
  }

  const chunks = transformTokens(tokens, selectionStart.ch, selectionEnd.ch);

  const withStart = chunks.find(c => c.containsSelectionStart);
  const withEnd = chunks.find(c => c.containsSelectionEnd);

  return {
    string: chunks.map(c => c.string).join(''),
    selectionStart: withStart.start + withStart.relativeSelectionStart,
    selectionEnd: withEnd.start + withEnd.relativeSelectionEnd
  };
}

function transformNoTokens(selectionStart, selectionEnd) {
  return {
    string: '****',
    selectionStart: selectionStart + 2,
    selectionEnd: selectionEnd + 2
  };
}