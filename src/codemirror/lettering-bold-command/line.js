import {
  LETTERING_CONTENT,
  LETTERING_BOLD,
} from '../comic-writer-mode/token';

/*
TODO
- add a flag to chunk: contains selection start, contains selection end
if that is true, we look at its selection start/end deltas, otherwise ignore them
- selection placement is wrong
- seeing issues with "no chunks selected" when cursor at front/back of a chunk
- when insert empty bold, place cursor relative to teh chunk that contains it, not relative to the entire line
*/

export default class Line {
  constructor(tokens, selectionStart, selectionEnd) {
    this.tokens = tokens;
    this.originalSelectionStart = selectionStart.ch;
    this.originalSelectionEnd = selectionEnd.ch;

    console.log(`originalSelectionStart: ${this.originalSelectionStart}`);
    console.log(`originalSelectionEnd: ${this.originalSelectionEnd}`);


    const chunks = toChunks(tokens, selectionStart.ch, selectionEnd.ch);


    console.log(`after toChunks`);
    console.log(chunks);

    const singleCursor = selectionStart.ch === selectionEnd.ch;

    if (singleCursor && selectionStart.ch === chunks[0].start) {
      chunks.forEach(c => c.containsSelectionEnd = false);
      chunks[0].containsSelectionEnd = true;
      chunks[0].selected = true;
    }

    if (singleCursor && selectionEnd.ch === chunks[chunks.length - 1].end) {
      chunks.forEach(c => c.containsSelectionStart = false);
      chunks[chunks.length - 1].containsSelectionStart = true;
      chunks[chunks.length - 1].selected = true;
    }

    this.normalizedChunks = removeBoldStarsFromChunks(chunks, selectionStart.ch, selectionEnd.ch);

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
    console.log('after normalize');
    console.log(this.normalizedChunks);

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
      return this.boldSelected();
    }

    const selected = this.getSelected();
    if (selected.length === 1 && selected[0].whitespace && this.selectionIsSingleCursor()) {
      // insert empty bold at cursor
      return this.splitSelectedWithEmptyBold(this.originalSelectionStart - selected[0].start);
    }

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

    // return chunks
    //   .reduce((newArray, chunk, index, array) => {
    //     if (chunk.whitespace) {
    //       const previous = array[index - 1];
    //       const next = array[index + 1];

    //       if (previous && next) {
    //         if (previous.bold && next.bold) {
    //           newArray.push(chunk.toBold());
    //         } else if (!previous.bold && !next.bold) {
    //           newArray.push(chunk);
    //         } else {
    //           const newNonBold = chunk.clone();
    //           newNonBold.bold = false;
    //           newArray.push(newNonBold);
    //         }
    //       } else {
    //         newArray.push(chunk);
    //       }
    //     } else {
    //       newArray.push(chunk);
    //     }

    //     return newArray;
    //   }, []);
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
    return this.selectionStart === this.selectionEnd;
  }

  toggleSelected() {
    return this.transformSelected(chunk => chunk.toggle());
  }

  boldSelected() {
    return this.transformSelected(chunk => chunk.toBold());
  }

  splitSelectedWithEmptyBold(relativeSplitPosition) {
    return this.transformSelected(chunk => chunk.insertEmptyBoldAt(relativeSplitPosition));
  }

  transformSelected(fn) {
    return flatMap(this.normalizedChunks, chunk => {
      return chunk.selected ? fn(chunk) : chunk;
    });
  }

  // if selected is whitespace and selection is single cursor
  insertEmptyBold(selectedRelativePosition) {
    return this.transformSelected(selected => {
      const before = selected.string.slice(0, selectedRelativePosition);
      const after = selected.string.slice(selectedRelativePosition);

      const middle = createChunk('', true, selected.end, true);
      middle.relativeCursorLocation = selectedRelativePosition + 2;

      return [
        createChunk(before, selected.bold, selected.start, true),
        middle,
        createChunk(after, selected.bold, selected.end, true),
      ];
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

  return chunks;
}

export function createChunk(string, bold, start, selected) {
  return new Chunk(string, bold, start, selected);
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
  return start < selectionStart && end > selectionEnd;
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

    this.string = string;
    this.bold = bold;
    this.start = start;
    this.end = start + string.length;
    this.selectionStartDelta = 0;
    this.selectionEndDelta = 0;

    // if this is non-null, cursor is placed here and all selection deltas are
    // ignored
    this.relativeCursorLocation = null;
    this.selected = selected;

    this.containsSelectionStart = false;
    this.containsSelectionEnd = false;

    this.relativeSelectionStart = null;
    this.relativeSelectionEnd = null;
  }

  insertEmptyBoldAt(relativePosition) {
    const before = this.string.slice(0, relativePosition);
    const after = this.string.slice(relativePosition);

    const middle = new Chunk('', true, this.end, this.selected);
    middle.relativeCursorLocation = relativePosition + 2;

    return [
      new Chunk(before, this.bold, this.start, this.selected),
      middle,
      new Chunk(after, this.bold, this.end, this.selected),
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

    merged.selectionStartDelta += this.selectionStartDelta;
    merged.selectionStartDelta += other.selectionStartDelta;

    merged.selectionEndDelta += this.selectionEndDelta;
    merged.selectionEndDelta += other.selectionEndDelta;

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

      newChunk.selectionStartDelta += this.selectionStartDelta;
      if (newChunk.selectionStartDelta) {
        newChunk.selectionStartDelta += 2;
      }

      newChunk.selectionEndDelta += this.selectionEndDelta;
      if (newChunk.selectionEndDelta) {
        newChunk.selectionEndDelta += 2
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
        } else if (relativeSelectionEnd >= 0 && relativeSelectionEnd < this.string.length) {
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
    newChunk.selectionStartDelta = newSelectionStart - selectionStart;
    newChunk.selectionEndDelta = newSelectionEnd - selectionEnd;

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

    chunk.containsSelectionStart = selectionStart >= start && selectionStart < end;
    chunk.containsSelectionEnd = selectionEnd > start && selectionEnd <= end;

    if (chunk.containsSelectionStart) {
      chunk.relativeSelectionStart = selectionStart - start;
    }

    if (chunk.containsSelectionEnd) {
      chunk.relativeSelectionEnd = selectionEnd - start;
    }

    return chunk;
  }
}
