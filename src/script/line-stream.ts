import { SpreadContent } from '../parser/types';
import { isSpread } from '../parser';

/**
 * Wrapper around some lines in the script.
 */
export class LineStream {
  lines: Array<string>;
  currentLine: number;

  static fromLines(lines: Array<string>): LineStream {
    return new LineStream(lines);
  }

  static fromString(source: string): LineStream {
    return new LineStream((source || '').split('\n'));
  }

  private constructor(lines: Array<string>) {
    this.currentLine = 0;
    this.lines = lines;
  }

  toString(): string {
    return this.lines.join('\n');
  }

  nextIsSpreadStart(): boolean {
    return this.hasMoreLines() && isSpread(this.peek());
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

  consumeNextSpread(): SpreadContent {
    if (this.nextIsSpreadStart()) {
      return {
        spread: this.consume(),
        children: this.consumeUntilSpreadStart()
      };
    } else {
      throw new Error('stream has not been advanced to a spread line');
    }
  }

  consumeAllSpreads(): Array<SpreadContent> {
    const chunks: Array<SpreadContent> = [];

    while (this.hasMoreLines()) {
      chunks.push(this.consumeNextSpread());
    }

    return chunks;
  }

  peek(): string {
    return this.lines[this.currentLine];
  }

  hasMoreLines(): boolean {
    return this.currentLine < this.lines.length;
  }
}
