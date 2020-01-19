import { Token, Position } from 'codemirror';
import Chunk from './chunk';
import transformTokens from './transform-tokens';

interface ToggleResult {
  string: string,
  selectionStart: number,
  selectionEnd: number
}

export function toggle(
  tokens: Token[],
  selectionStart: Position,
  selectionEnd: Position
): ToggleResult {
  if (tokens.length === 0) {
    return transformNoTokens(selectionStart.ch, selectionEnd.ch);
  }

  const chunks = transformTokens(tokens, selectionStart.ch, selectionEnd.ch);

  const chunkWithStart = chunks.find(c => c.containsSelectionStart) as Chunk;
  const chunkWithEnd = chunks.find(c => c.containsSelectionEnd) as Chunk;

  return {
    string: chunks.map(c => c.string).join(''),
    selectionStart: chunkWithStart.start + chunkWithStart.relativeSelectionStart,
    selectionEnd: chunkWithEnd.start + chunkWithEnd.relativeSelectionEnd
  };
}

function transformNoTokens(selectionStart: number, selectionEnd: number): ToggleResult {
  return {
    string: '****',
    selectionStart: selectionStart + 2,
    selectionEnd: selectionEnd + 2
  };
}
