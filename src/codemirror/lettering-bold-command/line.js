import {
  LETTERING_BOLD,
} from '../comic-writer-mode/token';

import Chunk from './chunk';

/*
TODO
- **** with cursor at the end puts selection 2 chars too far to the right
*/

export default class Line {
  constructor(tokens, selectionStart, selectionEnd) {
    this.tokens = tokens;
    this.originalSelectionStart = selectionStart;
    this.originalSelectionEnd = selectionEnd;

    let chunks = toChunks(tokens, selectionStart, selectionEnd);

    console.log(`after toChunks`);
    console.log(chunks);

    // reconstruct bold whitespace
    chunks = cleanUpBoldFragments(chunks);

    console.log('after bold fragment clean up');
    console.log(chunks);

    this.normalizedChunks = removeBoldStarsFromChunks(chunks, selectionStart, selectionEnd);

    console.log('after removeBoldStarsFromChunks');
    console.log(this.normalizedChunks);

    // assert that exactly one chunk contains selection start and selection end
    const chunksContainingSelectionStart = this.normalizedChunks
      .filter(c => c.containsSelectionStart).length;

    const chunksContainingSelectionEnd = this.normalizedChunks
      .filter(c => c.containsSelectionEnd).length;

    if (chunksContainingSelectionStart !== 1) {
      throw new Error(`Expected 1 chunk containing selection start but was ${chunksContainingSelectionStart}`);
    }

    if (chunksContainingSelectionEnd !== 1) {
      throw new Error(`Expected 1 chunk containing selection end but was ${chunksContainingSelectionEnd}`);
    }
  }

  execute() {


    let chunks = this.transform();

    console.log('after transform');
    console.log(chunks);

    chunks = this.cleanUpWhitespace(chunks);

    console.log('after cleaning up cleanUpWhitespace');
    console.log(chunks);

    chunks = this.mergeRedundant(chunks);

    console.log('after mergeRedundant');
    console.log(chunks);

    chunks = this.addBoldStars(chunks);

    console.log('after addBoldStars');
    console.log(chunks);

    chunks = this.fixBoundaries(chunks);

    console.log('after fixBoundaries');
    console.log(chunks);

    return chunks;
  }

  transform() {
    if (this.hasMultipleWeightsSelected()) {
      console.log(`bolding selected chunks`);

      return this.boldSelected();
    }

    const selected = this.getSelected();
    if (selected.length === 1 && selected[0].whitespace && !selected[0].bold && this.selectionIsSingleCursor()) {
      console.log(`inserting empty bold at cursor`);

      // insert empty bold at cursor
      return this.splitSelectedWithEmptyBold(this.originalSelectionStart - selected[0].start);
    }


    console.log(`toggling selected chunks`);

    return this.toggleSelected();
  }

  // readjust start and end of every chunk
  fixBoundaries(chunks) {
    let position = chunks[0].start;
    chunks.forEach(chunk => {
      chunk.start = position;
      chunk.end = position + chunk.string.length;
      position += chunk.string.length;
    });
    return chunks;
  }

  cleanUpWhitespace(chunks) {
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
  mergeRedundant(chunks) {
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

  addBoldStars(chunks) {
    return chunks
      .map(chunk => chunk.addBoldStars());
  }

  getSelected() {
    return this.normalizedChunks.filter(c => c.selected);
  }

  hasMultipleWeightsSelected() {
    const selected = this.getSelected();
    return selected.some(c => c.bold) && selected.some(c => !c.bold);
  }

  selectionIsSingleCursor() {
    return this.originalSelectionStart === this.originalSelectionEnd;
  }

  toggleSelected() {
    return this.transformSelected(chunk => chunk.toggle());
  }

  boldSelected() {
    return this.transformSelected(chunk => chunk.toBold());
  }

  splitSelectedWithEmptyBold(relativePosition) {
    return this.transformSelected(chunk => chunk.insertEmptyBoldAt(relativePosition));
  }

  transformSelected(fn) {
    return flatMap(this.normalizedChunks, chunk => {
      return chunk.selected ? fn(chunk) : chunk;
    });
  }
}

/**
 * Convert some CM tokens to chunks.
 *
 * @param {Token[]} tokens - Array of {start, end, string, type}
 * @returns {Chunk[]}
 */
export function toChunks(tokens, selectionStart, selectionEnd) {
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
export function removeBoldStarsFromChunks(chunks, selectionStart, selectionEnd) {
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
