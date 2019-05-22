export default class Chunk {
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
      chunk.relativeSelectionStart = this.relativeSelectionStart;
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

function startsWithStars(string) {
  return /^\*\*/.test(string);
}

function endsWithStars(string) {
  return /\*\*$/.test(string);
}
