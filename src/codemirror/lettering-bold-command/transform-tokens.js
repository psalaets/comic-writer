import {
  LETTERING_BOLD,
} from '../comic-writer-mode/token';

import Chunk from './chunk';

export default function transformTokens(tokens, selectionStart, selectionEnd) {
  let chunks = toChunks(tokens, selectionStart, selectionEnd);

  // reconstruct bold whitespace
  chunks = cleanUpBoldFragments(chunks);

  chunks = removeBoldStarsFromChunks(chunks, selectionStart, selectionEnd);

  // assert that exactly one chunk contains selection start and selection end
  const countWithSelectionStart = chunks
    .filter(c => c.containsSelectionStart).length;

  const countWithSelectionEnd = chunks
    .filter(c => c.containsSelectionEnd).length;

  if (countWithSelectionStart !== 1) {
    throw new Error(`Expected 1 chunk containing selection start but was ${countWithSelectionStart}`);
  }

  if (countWithSelectionEnd !== 1) {
    throw new Error(`Expected 1 chunk containing selection end but was ${countWithSelectionEnd}`);
  }

  chunks = transform(chunks, selectionStart, selectionEnd);

  chunks = cleanUpWhitespace(chunks);

  chunks = mergeSameWeightNeighbors(chunks);

  chunks = addBoldStars(chunks);

  chunks = recalculateBoundaries(chunks);

  return chunks;
}

function transform(chunks, selectionStart, selectionEnd) {
  const selected = chunks.filter(c => c.selected);

  if (hasMultipleWeights(selected)) {
    return boldSelected(chunks);
  }

  const singleCursor = selectionStart === selectionEnd;
  if (isOneNonBoldWhitespace(selected) && singleCursor) {
    // insert empty bold at cursor
    return splitSelectedWithEmptyBold(chunks, selectionStart - selected[0].start);
  }

  return toggleSelected(chunks);
}

// change whitespace weight based on weights of its neighbors
function cleanUpWhitespace(chunks) {
  return chunks
    .map((chunk, index, array) => {
      if (chunk.whitespace) {
        const previous = array[index - 1];
        const next = array[index + 1];

        if (previous && next) {
          if (previous.bold && next.bold) {
            return chunk.toBold();
          } else if (!previous.bold && !next.bold) {
            return chunk;
          } else {
            return chunk.toNonBold();
          }
        } else {
          return chunk;
        }
      } else {
        return chunk;
      }
    });
}

// bold next to bold becomes one bold
// non-bold next to non-bold becomes one non-bold
function mergeSameWeightNeighbors(chunks) {
  return chunks
    .reduce((arr, current) => {
      if (arr.length > 0) {
        const last = arr[arr.length - 1];
        // merge adjacent chunks of same weight
        if (current.bold === last.bold) {
          arr[arr.length - 1] = last.merge(current);
        } else {
          arr.push(current);
        }
      } else {
        arr.push(current);
      }

      return arr;
    }, []);
}

function addBoldStars(chunks) {
  return chunks.map(chunk => chunk.addBoldStars());
}

// readjust start and end of every chunk
function recalculateBoundaries(chunks) {
  let position = chunks[0].start;
  chunks.forEach(chunk => {
    chunk.start = position;
    chunk.end = position + chunk.string.length;
    position += chunk.string.length;
  });
  return chunks;
}

function isOneNonBoldWhitespace(chunks) {
  if (chunks.length === 1) {
    const loneChunk = chunks[0];
    return !loneChunk.bold && loneChunk.whitespace;
  }
  return false;
}

function hasMultipleWeights(chunks) {
  return chunks.some(c => c.bold) && chunks.some(c => !c.bold);
}

function toggleSelected(chunks) {
  return transformSelected(chunks, chunk => chunk.toggle());
}

function boldSelected(chunks) {
  return transformSelected(chunks, chunk => chunk.toBold());
}

function splitSelectedWithEmptyBold(chunks, relativePosition) {
  return transformSelected(chunks, chunk => chunk.insertEmptyBoldAt(relativePosition));
}

function transformSelected(chunks, fn) {
  return flatMap(chunks, chunk => {
    return chunk.selected ? fn(chunk) : chunk;
  });
}

/**
 * Convert some CM tokens to chunks.
 *
 * @param {Token[]} tokens - Array of {start, end, string, type}
 * @returns {Chunk[]}
 */
function toChunks(tokens, selectionStart, selectionEnd) {
  const chunks = flatMap(tokens, token => {
    let position = token.start;

    return token.string
      .split(/(\s+)/g)
      .filter(part => part)
      .map(part => {
        const start = position;
        const chunk = Chunk.create(part, isBold(token), start, selectionStart, selectionEnd);

        position += part.length;

        return chunk;
      });
  });

  const singleCursor = selectionStart === selectionEnd;

  // single cursor at the very front of chunks
  const firstChunk = chunks[0];
  if (singleCursor && selectionStart === firstChunk.start) {
    chunks.forEach(c => c.containsSelectionEnd = false);
    firstChunk.containsSelectionStart = true;
    firstChunk.containsSelectionEnd = true;
    firstChunk.relativeSelectionStart = selectionStart - firstChunk.start;
    firstChunk.relativeSelectionEnd = selectionEnd - firstChunk.start;
    firstChunk.selected = true;
  }

  // single cursor at the very back of chunks
  const lastChunk = chunks[chunks.length - 1];
  if (singleCursor && selectionEnd === lastChunk.end) {
    chunks.forEach(c => c.containsSelectionStart = false);
    lastChunk.containsSelectionStart = true;
    lastChunk.containsSelectionEnd = true;
    lastChunk.relativeSelectionStart = selectionStart - lastChunk.start;
    lastChunk.relativeSelectionEnd = selectionEnd - lastChunk.start;
    lastChunk.selected = true;
  }

  // if a whitespace chunk contains single cursor but it's at boundary between it
  // and a non-whitespace chunk, give seletion to the non-whitespace chunk

  if (singleCursor) {
    const index = chunks.findIndex(c => c.containsSelectionStart);
    const containsCursor = chunks[index];

    if (containsCursor.whitespace) {
      const prev = chunks[index - 1];

      if (prev && selectionStart === containsCursor.start) {
        prev.containsSelectionStart = true;
        prev.containsSelectionEnd = true;
        prev.relativeSelectionStart = selectionStart - prev.start;
        prev.relativeSelectionEnd = selectionEnd - prev.start;
        prev.selected = true;

        containsCursor.containsSelectionStart = false;
        containsCursor.containsSelectionEnd = false;
        containsCursor.selected = false;
      }
    }
  }

  return chunks;
}

function isBold(token) {
  return Boolean(token.type) && token.type.includes(LETTERING_BOLD);
}

/**
 * Removes bold stars from chunks
 *
 * @param {*} chunks
 * @param {*} selectionStart
 * @param {*} selectionEnd
 * @returns chunks
 */
function removeBoldStarsFromChunks(chunks, selectionStart, selectionEnd) {
  return chunks
    .map(chunk => chunk.removeBoldStars(selectionStart, selectionEnd));
}

function cleanUpBoldFragments(chunks) {
  return chunks.reduce((array, current) => {
    if (array.length > 0) {
      const last = array[array.length - 1];

      if (last.bold && last.string === '**' && current.bold) {
        array[array.length - 1] = last.merge(current);
      } else if (current.bold && current.string === '**' && last.bold) {
        array[array.length - 1] = last.merge(current);
      } else {
        array.push(current);
      }
    } else {
      array.push(current);
    }

    return array;
  }, []);
}

function flatMap(array, fn) {
  return array
    .map(fn)
    .reduce((result, current) => {
      if (Array.isArray(current)) {
        result.push(...current);
      } else {
        result.push(current);
      }

      return result;
    }, []);
}