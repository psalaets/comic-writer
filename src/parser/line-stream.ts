import { SPREAD_REGEX } from './regexes';
import { SpreadLines } from './types';

/**
 * Wrapper around some lines in the script.
 */
export class LineStream {
  lines: Array<string>;
  currentLine: number;

  static fromString(source: string): LineStream {
    return new LineStream((source || '').split('\n'));
  }

  private constructor(lines: Array<string>) {
    this.currentLine = 0;
    this.lines = lines;
  }

  nextIsSpreadStart(): boolean {
    return this.hasMoreLines() && SPREAD_REGEX.test(this.peek());
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

  consumeNextSpread(): SpreadLines {
    if (this.nextIsSpreadStart()) {
      return {
        spread: this.consume(),
        children: this.consumeUntilSpreadStart()
      };
    } else {
      throw new Error('stream has not been advanced to a spread line');
    }
  }

  consumeAllSpreads(): Array<SpreadLines> {
    const spreads: Array<SpreadLines> = [];

    while (this.hasMoreLines()) {
      spreads.push(this.consumeNextSpread());
    }

    return spreads;
  }

  peek(): string {
    return this.lines[this.currentLine];
  }

  hasMoreLines(): boolean {
    return this.currentLine < this.lines.length;
  }
}
