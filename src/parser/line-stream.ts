import {
  SPREAD_REGEX,
  PANEL_REGEX,
  CAPTION_REGEX,
  SFX_REGEX,
  DIALOGUE_REGEX,
  METADATA_REGEX,
  PARAGRAPH_REGEX,
} from './regexes';

/**
 * Wrapper around some lines in the script.
 */
export class LineStream {
  lines: Array<string>;
  currentLine: number;

  static fromString(source: string): LineStream {
    return new LineStream((source || '').split('\n'));
  }

  static fromLines(lines: Array<string>): LineStream {
    return new LineStream(lines);
  }

  private constructor(lines: Array<string>) {
    this.currentLine = 0;
    this.lines = lines;
  }

  get lineNumber() {
    return this.currentLine;
  }

  nextIsSfx(): boolean {
    return this.hasMoreLines() && SFX_REGEX.test(this.peek());
  }

  nextIsCaption(): boolean {
    return this.hasMoreLines() && CAPTION_REGEX.test(this.peek());
  }

  nextIsDialogue(): boolean {
    return this.hasMoreLines() && DIALOGUE_REGEX.test(this.peek());
  }

  nextIsMetadata(): boolean {
    return this.hasMoreLines() && METADATA_REGEX.test(this.peek());
  }

  nextIsParagraph(): boolean {
    return this.hasMoreLines() && PARAGRAPH_REGEX.test(this.peek());
  }

  nextIsPanelStart(): boolean {
    return this.hasMoreLines() && PANEL_REGEX.test(this.peek());
  }

  nextIsSpreadStart(): boolean {
    return this.hasMoreLines() && SPREAD_REGEX.test(this.peek());
  }

  nextIsSpreadEnd(): boolean {
    return !this.hasMoreLines() || this.nextIsSpreadStart();
  }

  nextIsPanelEnd(): boolean {
    return !this.hasMoreLines() || this.nextIsSpreadStart() || this.nextIsPanelStart();
  }

  nextIsEmpty(): boolean {
    return this.hasMoreLines() && this.peek().trim() === '';
  }

  consume(): string {
    const line = this.peek();
    this.currentLine += 1;
    return line;
  }

  consumeUntilSpreadStart(): Array<string> {
    const consumed: Array<string> = [];

    while (this.hasMoreLines() && !this.nextIsSpreadStart()) {
      consumed.push(this.consume());
    }

    return consumed;
  }

  consumeNextSpread(): Array<string> {
    const consumed: Array<string> = [];

    if (this.hasMoreLines()) {
      if (this.nextIsSpreadStart()) {
        consumed.push(this.consume());
        consumed.push(...this.consumeUntilSpreadStart());
      } else {
        throw new Error('stream has not been advanced to a spread');
      }
    }

    return consumed;
  }

  peek(): string {
    return this.lines[this.currentLine];
  }

  hasMoreLines(): boolean {
    return this.currentLine < this.lines.length;
  }
}
