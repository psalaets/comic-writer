import { Token } from 'codemirror';
import {
  LETTERING_SUBJECT,
  LETTERING_MODIFIER,
  LETTERING_CONTENT
} from '../mode/token';

/**
 * Some convenience logic based around a line of lettering tokens.
 */
export class LetteringLine {
  tokens: Array<Token>;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens.slice();
  }

  /**
   * Get the subject token, if it exists.
   */
  getSubject(): Token | null {
    return this._firstWithType(LETTERING_SUBJECT);
  }

  /**
   * Get the modifier token, if it exists.
   */
  getModifier(): Token | null {
    return this._firstWithType(LETTERING_MODIFIER);
  }

  /**
   * Get the content token, if it exists.
   */
  getContent(): Token | null {
    return this._firstWithType(LETTERING_CONTENT);
  }

  /**
   * Get the "before content" separator token, if it exists.
   */
  getBeforeContent(): Token | null {
    const contentIndex = this._firstIndexByType(LETTERING_CONTENT);

    if (contentIndex > 0) {
      return this._byIndex(contentIndex - 1);
    } else {
      return null;
    }
  }

  /**
   * Get the "after subject" separator token, if it exists.
   */
  getAfterSubject(): Token | null {
    const subjectIndex = this._firstIndexByType(LETTERING_SUBJECT);

    if (subjectIndex !== -1 && subjectIndex < this.tokens.length - 1) {
      return this._byIndex(subjectIndex + 1);
    } else {
      return null;
    }
  }

  /**
   * Do the parens exists before the content?
   */
  hasModifierMarkersBeforeContent(): boolean {
    let text = this._lineText();

    // chop off the end starting at the colon before the content
    const colonIndex = text.indexOf(':');
    if (colonIndex !== -1) {
      text = text.slice(0, colonIndex);
    }

    // look for modifier markers in remainder
    return /\(.*?\)/.test(text);
  }

  /**
   * Is a cursor between the subject and content?
   *
   * @param cursor
   */
  isBetweenSubjectAndContent(cursor: CodeMirror.Position): boolean {
    const subject = this.getSubject();
    const beforeContent = this.getBeforeContent();

    if (subject && beforeContent) {
      const colonIndex = beforeContent.start + beforeContent.string.indexOf(':');
      return subject.end <= cursor.ch && cursor.ch <= colonIndex;
    } else {
      return false;
    }
  }

  /**
   * The text that comprises this line.
   */
  _lineText() {
    return this.tokens
      .map(token => token.string)
      .join('');
  }

  /**
   * Find the first token that has a given type.
   *
   * @param type
   */
  _firstWithType(type: string): Token | null {
    return this._byIndex(this._firstIndexByType(type));
  }

  /**
   * Get a token by index.
   *
   * @param index Zero-based index
   */
  _byIndex(index: number): Token | null {
    if (index < 0 || index >= this.tokens.length) {
      return null;
    }

    return this.tokens[index];
  }

  /**
   * Get the index of the first token of a given type.
   *
   * @param type
   * @returns Zero-based token index or -1 if not found
   */
  _firstIndexByType(type: string): number {
    return this.tokens
      .findIndex(token => token.type?.includes(type));
  }
}
