/**
 * A piece of a string in lettering.
 */
export default class Chunk {
  whitespace: boolean;
  string: string;
  bold: boolean;
  start: number;
  end: number;

  selected: boolean;

  containsSelectionStart = false;
  containsSelectionEnd = false;

  relativeSelectionStart = -1;
  relativeSelectionEnd = -1;

  constructor(string: string, bold: boolean, start:  number, selected: boolean) {
    this.whitespace = bold
      ? /^(\*\*)?\s+(\*\*)?$/.test(string)
      : /^\s+$/.test(string);

    this.string = string;
    this.bold = bold;
    this.start = start;
    this.end = start + string.length;

    this.selected = selected;
  }

  /**
   * Split this and insert an empty bold chunk at the split point.
   *
   * @param {Number} relativePosition - Relative position to split at
   * @returns Array of resulting chunks
   */
  insertEmptyBoldAt(relativePosition: number): Array<Chunk> {
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

  /**
   * Merge some other chunk into this.
   *
   * @param {Chunk} other - Chunk to merge into this, must be same weight as this
   * @returns Chunk that results from the merge
   */
  merge(other: Chunk): Chunk {
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

  /**
   * Wrap the string of this chunk, if it's bold.
   *
   * @returns Chunk that results from wrapping with stars.
   */
  addBoldStars(): Chunk {
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

      return newChunk;
    } else {
      return this;
    }
  }

  /**
   * Removes bold stars from this chunk.
   *
   * @param {Number} selectionStart - Position of selecton start
   * @param {Number} selectionEnd - Position of selecton end
   * @returns Chunks that results from removing the bold stars
   */
  removeBoldStars(selectionStart: number, selectionEnd: number): Chunk {
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
        } else if (relativeSelectionStart >= 0 && relativeSelectionStart <= this.string.length) {
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

  /**
   * Toggle this chunk to the other weight.
   *
   * @returns Chunk that results from the toggle.
   */
  toggle(): Chunk {
    return this.bold ? this.toNonBold() : this.toBold();
  }

  /**
   * Convert this chunk to bold.
   *
   * @returns Bold chunk
   */
  toBold(): Chunk {
    if (this.bold) {
      return this;
    } else {
      const chunk = this.clone();
      chunk.bold = true;
      return chunk;
    }
  }

  /**
   * Convert this chunks to non-bold.
   *
   * @returns Non-bold chunk
   */
  toNonBold(): Chunk {
    if (this.bold) {
      const chunk = this.clone();
      chunk.bold = false;
      return chunk;
    } else {
      return this;
    }
  }

  /**
   * Copy this chunk.
   *
   * @returns copy
   */
  clone(): Chunk {
    const chunk = new Chunk(this.string, this.bold, this.start, this.selected);

    chunk.containsSelectionStart = this.containsSelectionStart;
    if (this.containsSelectionStart) {
      chunk.relativeSelectionStart = this.relativeSelectionStart;
    }

    chunk.containsSelectionEnd = this.containsSelectionEnd;
    if (this.containsSelectionEnd) {
      chunk.relativeSelectionEnd = this.relativeSelectionEnd;
    }

    return chunk;
  }

  /**
   * Create a new Chunk.
   *
   * @param {String} string
   * @param {Boolean} bold
   * @param {Number} start
   * @param {Number} selectionStart
   * @param {Number} selectionEnd
   * @returns New chunk
   */
  static create(
    string: string,
    bold: boolean,
    start: number,
    selectionStart: number,
    selectionEnd: number
  ): Chunk {
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

function selected(
  start: number,
  end: number,
  selectionStart: number,
  selectionEnd: number
): boolean {
  return selectionContainsStart(start, selectionStart, selectionEnd)
    || selectionContainsEnd(end, selectionStart, selectionEnd)
    || containsSelection(start, end, selectionStart, selectionEnd);
}

function selectionContainsStart(
  start: number,
  selectionStart: number,
  selectionEnd: number
): boolean {
  return start >= selectionStart && start < selectionEnd;
}

function selectionContainsEnd(
  end: number,
  selectionStart: number,
  selectionEnd: number
): boolean {
  return end > selectionStart && end <= selectionEnd;
}

function containsSelection(
  start: number,
  end: number,
  selectionStart: number,
  selectionEnd: number
): boolean {
  return selectionStart >= start && end > selectionEnd;
}

function startsWithStars(string: string): boolean {
  return /^\*\*/.test(string);
}

function endsWithStars(string: string): boolean {
  return /\*\*$/.test(string);
}
