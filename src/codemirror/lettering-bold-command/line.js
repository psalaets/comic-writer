import {
  LETTERING_CONTENT,
  LETTERING_BOLD,
} from '../comic-writer-mode/token';

/*
TODO
- **** with cursor at the end puts selection 2 chars too far to the right
*/

export default class Line {
  constructor(tokens, selectionStart, selectionEnd) {
    console.log('incoming tokens');
    console.log(tokens);

    this.tokens = tokens;
    this.originalSelectionStart = selectionStart.ch;
    this.originalSelectionEnd = selectionEnd.ch;

    console.log(`originalSelectionStart: ${this.originalSelectionStart}`);
    console.log(`originalSelectionEnd: ${this.originalSelectionEnd}`);


    let chunks = toChunks(tokens, selectionStart.ch, selectionEnd.ch);

    console.log(`after toChunks`);
    console.log(chunks);

    // reconstruct bold whitespace
    chunks = cleanUpBoldFragments(chunks);

    console.log('after bold fragment clean up');
    console.log(chunks);

    this.normalizedChunks = removeBoldStarsFromChunks(chunks, selectionStart.ch, selectionEnd.ch);

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

function selected(start, end, selectionStart, selectionEnd) {
  return selectionContainsStart(start, selectionStart, selectionEnd)
    || selectionContainsEnd(end, selectionStart, selectionEnd)
    || containsSelection(start, end, selectionStart, selectionEnd);
}

function selectionContainsStart(start, selectionStart, selectionEnd) {
  return start >= selectionStart && start < selectionEnd;
}

function selectionContainsEnd(end, selectionStart, selectionEnd) {
  return end > selectionStart && end <= selectionEnd;
}

function containsSelection(start, end, selectionStart, selectionEnd) {
  return selectionStart >= start && end > selectionEnd;
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

function startsWithStars(string) {
  return /^\*\*/.test(string);
}

function endsWithStars(string) {
  return /\*\*$/.test(string);
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


function wrapBold(string) {
  return `**${string}**`;
}

function unwrapBold(string) {
  return string.replace(/\*\*/g, '');
}

class Chunk {
  constructor(string, bold, start, selected) {
    this.whitespace = bold
      ? /^(\*\*)?\s+(\*\*)?$/.test(string)
      : /^\s+$/.test(string);
    this.empty = string === '';

    this.string = string;
    this.bold = bold;
    this.start = start;
    this.end = start + string.length;

    this.selected = selected;

    this.containsSelectionStart = false;
    this.containsSelectionEnd = false;

    this._relativeSelectionStart = null;
    this._relativeSelectionEnd = null;
  }

  get relativeSelectionStart() {
    return this._relativeSelectionStart;
  }

  set relativeSelectionStart(value) {
    this._relativeSelectionStart = value;
  }

  get relativeSelectionEnd() {
    return this._relativeSelectionEnd;
  }

  set relativeSelectionEnd(value) {
    this._relativeSelectionEnd = value;
  }

  insertEmptyBoldAt(relativePosition) {
    const before = this.string.slice(0, relativePosition);
    const after = this.string.slice(relativePosition);

    const middle = new Chunk('', true, this.end, this.selected);
    middle.containsSelectionStart = true;
    middle.relativeSelectionStart = 0;
    middle.containsSelectionEnd = true;
    middle.relativeSelectionEnd = 0;

    return [
      new Chunk(before, this.bold, this.start, false),
      middle,
      new Chunk(after, this.bold, this.end, false),
    ];
  }

  merge(other) {
    if (this.bold !== other.bold) {
      throw new Error('cannot merge chunks of different weights');
    }

    const merged = new Chunk(this.string + other.string, this.bold, this.start, this.selected || other.selected);

    if (this.containsSelectionStart) {
      merged.containsSelectionStart = true;
      merged.relativeSelectionStart = this.relativeSelectionStart;
    }

    if (other.containsSelectionStart) {
      merged.containsSelectionStart = true;
      merged.relativeSelectionStart = other.relativeSelectionStart + this.string.length;
    }

    if (this.containsSelectionEnd) {
      merged.containsSelectionEnd = true;
      merged.relativeSelectionEnd = this.relativeSelectionEnd;
    }

    if (other.containsSelectionEnd) {
      merged.containsSelectionEnd = true;
      merged.relativeSelectionEnd = other.relativeSelectionEnd + this.string.length;
    }

    return merged;
  }

  addBoldStars() {
    if (this.bold) {
      const newChunk = new Chunk(
        '**' + this.string + '**',
        this.bold,
        this.start,
        this.selected
      );

      if (this.containsSelectionStart) {
        newChunk.containsSelectionStart = true;
        newChunk.relativeSelectionStart = this.relativeSelectionStart + 2;
      }

      if (this.containsSelectionEnd) {
        newChunk.containsSelectionEnd = true;
        newChunk.relativeSelectionEnd = this.relativeSelectionEnd + 2;
      }

      newChunk.relativeCursorLocation = this.relativeCursorLocation;
      if (newChunk.relativeCursorLocation != null) {
        newChunk.relativeCursorLocation += 2;
      }

      return newChunk;
    } else {
      return this;
    }
  }

  removeBoldStars(selectionStart, selectionEnd) {
    let newString = this.string;

    let newSelectionStart = selectionStart;
    let newSelectionEnd = selectionEnd;

    if (startsWithStars(this.string)) {
      newString = newString.slice(2);

      if (this.selected) {
        const relativeSelectionStart = selectionStart - this.start;
        const relativeSelectionEnd = selectionEnd - this.start;

        if (relativeSelectionStart >= 0 && relativeSelectionStart <= 2) {
          newSelectionStart -= relativeSelectionStart;
        } else if (relativeSelectionStart >= 0 && relativeSelectionStart < this.string.length) {
          newSelectionStart -= 2;
        }

        if (relativeSelectionEnd >= 0 && relativeSelectionEnd <= 2) {
          newSelectionEnd -= relativeSelectionEnd;
        } else if (relativeSelectionEnd >= 0 && relativeSelectionEnd <= this.string.length) {
          newSelectionEnd -= 2;
        }
      }
    }

    if (endsWithStars(this.string)) {
      newString = newString.slice(0, -2);

      if (this.selected) {
        const selectionEndToEnd = this.end - selectionEnd;
        const selectionStartToEnd = this.end - selectionStart;

        if (selectionStartToEnd >= 0 && selectionStartToEnd <= 2) {
          newSelectionStart -= 2 - selectionStartToEnd;
        }

        if (selectionEndToEnd >= 0 && selectionEndToEnd <= 2) {
          newSelectionEnd -= 2 - selectionEndToEnd;
        }
      }
    }

    const newChunk = new Chunk(newString, this.bold, this.start, this.selected);

    newChunk.containsSelectionStart = this.containsSelectionStart;
    newChunk.containsSelectionEnd = this.containsSelectionEnd;

    if (this.containsSelectionStart) {
      newChunk.relativeSelectionStart = this.relativeSelectionStart + (newSelectionStart - selectionStart);
    }

    if (this.containsSelectionEnd) {
      newChunk.relativeSelectionEnd = this.relativeSelectionEnd + (newSelectionEnd - selectionEnd);
    }

    return newChunk;
  }

  toggle() {
    return this.bold ? this.toNonBold() : this.toBold();
  }

  toBold() {
    if (this.bold) {
      return this;
    } else {
      const chunk = this.clone();
      chunk.bold = true;
      return chunk;
    }
  }

  toNonBold() {
    if (this.bold) {
      const chunk = this.clone();
      chunk.bold = false;
      return chunk;
    } else {
      return this;
    }
  }

  clone() {
    const chunk = new Chunk(this.string, this.bold, this.start, this.selected);

    chunk.containsSelectionStart = this.containsSelectionStart;
    if (this.containsSelectionStart) {
      chunk.relativeSelectionStart =  this.relativeSelectionStart;
    }

    chunk.containsSelectionEnd = this.containsSelectionEnd;
    if (this.containsSelectionEnd) {
      chunk.relativeSelectionEnd = this.relativeSelectionEnd;
    }

    return chunk;
  }

  static create(string, bold, start, selectionStart, selectionEnd) {
    const end = start + string.length;
    const chunk = new Chunk(
      string,
      bold,
      start,
      selected(start, end, selectionStart, selectionEnd)
    );

    const singleCursor = selectionStart === selectionEnd;
    if (singleCursor) {
      chunk.containsSelectionStart = selectionStart >= start && selectionStart < end;
      chunk.containsSelectionEnd = chunk.containsSelectionStart;
    } else {
      chunk.containsSelectionStart = selectionStart >= start && selectionStart < end;
      chunk.containsSelectionEnd = selectionEnd > start && selectionEnd <= end;
    }

    if (chunk.containsSelectionStart) {
      chunk.relativeSelectionStart = selectionStart - start;
    }

    if (chunk.containsSelectionEnd) {
      chunk.relativeSelectionEnd = selectionEnd - start;
    }

    return chunk;
  }
}
