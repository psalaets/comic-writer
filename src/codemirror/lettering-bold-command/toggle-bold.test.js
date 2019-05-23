import {
  LETTERING_CONTENT,
  LETTERING_BOLD,
} from '../comic-writer-mode/token';

import { toggle } from './toggle-bold';

describe('toggle()', () => {
  describe('no tokens', () => {
    test('just a cursor', () => {
      const tokens = [];

      const result = execute(tokens, 0, 0, 0);

      expect(result).toEqual({
        string: '****',
        selectionStart: 2,
        selectionEnd: 2
      });
    });
  });

  describe('one non-bold word', () => {
    test('fully selected', () => {
      const tokens = ['one'];

      const result = execute(tokens, 4, 4, 7);

      expect(result).toEqual({
        string: '**one**',
        selectionStart: 6,
        selectionEnd: 9
      });
    });

    test('only front selected', () => {
      const tokens = ['one'];

      const result = execute(tokens, 4, 4, 6);

      expect(result).toEqual({
        string: '**one**',
        selectionStart: 6,
        selectionEnd: 8
      });
    });

    test('only back selected', () => {
      const tokens = ['one'];

      const result = execute(tokens, 4, 5, 7);

      expect(result).toEqual({
        string: '**one**',
        selectionStart: 7,
        selectionEnd: 9
      });
    });

    test('only middle selected', () => {
      const tokens = ['one'];

      const result = execute(tokens, 4, 5, 6);

      expect(result).toEqual({
        string: '**one**',
        selectionStart: 7,
        selectionEnd: 8
      });
    });

    test('just cursor on token', () => {
      const tokens = ['one'];

      const result = execute(tokens, 4, 5, 5);

      expect(result).toEqual({
        string: '**one**',
        selectionStart: 7,
        selectionEnd: 7
      });
    });

  });

  describe('multiple non-bold words', () => {
    test('just a cursor on a word', () => {
      const tokens = ['one two three'];

      const result = execute(tokens, 4, 5, 5);

      expect(result).toEqual({
        string: '**one** two three',
        selectionStart: 7,
        selectionEnd: 7
      });
    });

    test('just a cursor in whitespace', () => {
      const tokens = ['one  two'];

      const result = execute(tokens, 4, 8, 8);

      expect(result).toEqual({
        string: 'one **** two',
        selectionStart: 10,
        selectionEnd: 10
      });
    });

    test('all fully selected', () => {
      const tokens = ['one two three'];

      const result = execute(tokens, 4, 4, 17);

      expect(result).toEqual({
        string: '**one two three**',
        selectionStart: 6,
        selectionEnd: 19
      });
    });

    test('some fully selected', () => {
      const tokens = ['one two three'];

      const result = execute(tokens, 4, 8, 17);

      expect(result).toEqual({
        string: 'one **two three**',
        selectionStart: 10,
        selectionEnd: 19
      });
    });

    test('one fully selected', () => {
      const tokens = ['one two three'];

      const result = execute(tokens, 4, 8, 11);

      expect(result).toEqual({
        string: 'one **two** three',
        selectionStart: 10,
        selectionEnd: 13
      });
    });
  });

  describe('one bold word', () => {
    test('fully selected', () => {
      const tokens = ['**one**'];

      const result = execute(tokens, 4, 4, 11);

      expect(result).toEqual({
        string: 'one',
        selectionStart: 4,
        selectionEnd: 7
      });
    });

    test('only front selected', () => {
      const tokens = ['**one**'];

      const result = execute(tokens, 4, 4, 7);

      expect(result).toEqual({
        string: 'one',
        selectionStart: 4,
        selectionEnd: 5
      });
    });

    test('only back selected', () => {
      const tokens = ['**one**'];

      const result = execute(tokens, 4, 8, 11);

      expect(result).toEqual({
        string: 'one',
        selectionStart: 6,
        selectionEnd: 7
      });
    });

    test('only middle selected', () => {
      const tokens = ['**one**'];

      const result = execute(tokens, 4, 7, 8);

      expect(result).toEqual({
        string: 'one',
        selectionStart: 5,
        selectionEnd: 6
      });
    });

    test('just cursor on token', () => {
      const tokens = ['**one**'];

      const result = execute(tokens, 4, 7, 7);

      expect(result).toEqual({
        string: 'one',
        selectionStart: 5,
        selectionEnd: 5
      });
    });

  });

  describe('multiple bold words', () => {
    test('just a cursor on a word', () => {
      const tokens = ['**one two three**'];

      const result = execute(tokens, 4, 7, 7);

      expect(result).toEqual({
        string: 'one **two three**',
        selectionStart: 5,
        selectionEnd: 5
      });
    });
    test('just a cursor in whitespace', () => {
      const tokens = ['**one  two**'];

      const result = execute(tokens, 4, 10, 10);

      expect(result).toEqual({
        string: '**one  two**',
        selectionStart: 10,
        selectionEnd: 10
      });
    });

    test('all fully selected', () => {
      const tokens = ['**one two three**'];

      const result = execute(tokens, 4, 4, 21);

      expect(result).toEqual({
        string: 'one two three',
        selectionStart: 4,
        selectionEnd: 17
      });
    });

    test('some fully selected', () => {
      const tokens = ['**one two three**'];

      const result = execute(tokens, 4, 4, 13);

      expect(result).toEqual({
        string: 'one two **three**',
        selectionStart: 4,
        selectionEnd: 11
      });
    });

    test('one fully selected', () => {
      const tokens = ['**one two three**'];

      const result = execute(tokens, 4, 10, 13);

      expect(result).toEqual({
        string: '**one** two **three**',
        selectionStart: 12,
        selectionEnd: 15
      });
    });
  });

  describe('mixed tokens: bold, not bold', () => {
    test('all fully selected', () => {
      const tokens = ['**bold**', ' not'];

      const result = execute(tokens, 4, 4, 16);

      expect(result).toEqual({
        string: '**bold not**',
        selectionStart: 6,
        selectionEnd: 14
      });
    });

    test('all partially selected', () => {
      const tokens = ['**bold**', ' not'];

      const result = execute(tokens, 4, 7, 14);

      expect(result).toEqual({
        string: '**bold not**',
        selectionStart: 7,
        selectionEnd: 12
      });
    });

    // LEFT OFF HERE
    test('bold fully selected', () => {
      const tokens = ['**bold**', ' not'];

      const result = execute(tokens, 4, 4, 12);

      expect(result).toEqual({
        string: 'bold not',
        selectionStart: 4,
        selectionEnd: 8
      });
    });

    test('non bold fully selected', () => {
      const tokens = ['**bold**', ' not'];

      const result = execute(tokens, 4, 13, 16);

      expect(result).toEqual({
        string: '**bold not**',
        selectionStart: 11,
        selectionEnd: 14
      });
    });
  });

  describe('mixed tokens: bold, not bold, bold', () => {
    test('all fully selected', () => {
      const tokens = ['**bold**', ' not ', '**bold**'];

      const result = execute(tokens, 4, 4, 25);

      expect(result).toEqual({
        string: '**bold not bold**',
        selectionStart: 6,
        selectionEnd: 19
      });
    });

    test('ends partially selected', () => {
      const tokens = ['**bold**', ' not ', '**bold**'];

      const result = execute(tokens, 4, 7, 22);

      expect(result).toEqual({
        string: '**bold not bold**',
        selectionStart: 7,
        selectionEnd: 18
      });
    });

    test('middle fully selected', () => {
      const tokens = ['**bold**', ' not ', '**bold**'];

      const result = execute(tokens, 4, 13, 16);

      expect(result).toEqual({
        string: '**bold not bold**',
        selectionStart: 11,
        selectionEnd: 14
      });
    });

    test('non bold partially selected', () => {
      const tokens = ['**bold**', ' not here ', '**bold**'];

      const result = execute(tokens, 4, 7, 16);

      expect(result).toEqual({
        string: '**bold not** here **bold**',
        selectionStart: 7,
        selectionEnd: 14
      });
    });
  });

  describe('space between tokens', () => {
    test('1 space between bolds', () => {
      const tokens = ['**bold**', ' not'];

      const result = execute(tokens, 4, 13, 16);

      expect(result).toEqual({
        string: '**bold not**',
        selectionStart: 11,
        selectionEnd: 14
      });
    });

    test('some spaces between bolds', () => {
      const tokens = ['**bold**', '   not'];

      const result = execute(tokens, 4, 15, 18);

      expect(result).toEqual({
        string: '**bold   not**',
        selectionStart: 13,
        selectionEnd: 16
      });
    });

    // weird
    test('1 space between bold and non bold', () => {
      const tokens = ['soon not'];

      const result = execute(tokens, 4, 4, 9);

      expect(result).toEqual({
        string: '**soon** not',
        selectionStart: 6,
        selectionEnd: 12
      });
    });

    // weird
    test('some spaces between bold and non bold', () => {
      const tokens = ['soon   not'];

      const result = execute(tokens, 4, 4, 9);

      expect(result).toEqual({
        string: '**soon**   not',
        selectionStart: 6,
        selectionEnd: 12
      });
    });

    // weird
    test('1 space between non bold and bold', () => {
      const tokens = ['not soon'];

      const result = execute(tokens, 4, 7, 12);

      expect(result).toEqual({
        string: 'not **soon**',
        selectionStart: 7,
        selectionEnd: 8
      });
    });

    // weird
    test('some spaces between non bold and bold', () => {
      const tokens = ['not   soon'];

      const result = execute(tokens, 4, 7, 12);

      expect(result).toEqual({
        string: 'not   **soon**',
        selectionStart: 7,
        selectionEnd: 10
      });
    });
  });

  describe('cursor at boundaries', () => {
    it('cursor at line start', () => {
      const tokens = ['one two three'];

      const result = execute(tokens, 4, 4, 4);

      expect(result).toEqual({
        string: '**one** two three',
        selectionStart: 6,
        selectionEnd: 6
      });
    });

    it('cursor at line end', () => {
      const tokens = ['one two three'];

      const result = execute(tokens, 4, 17, 17);

      expect(result).toEqual({
        string: 'one two **three**',
        selectionStart: 19,
        selectionEnd: 19
      });
    });

    it('cursor at non-bold start', () => {
      const tokens = ['one two three'];

      const result = execute(tokens, 4, 8, 8);

      expect(result).toEqual({
        string: 'one **two** three',
        selectionStart: 10,
        selectionEnd: 10
      });
    });

    it('cursor at non-bold end', () => {
      const tokens = ['one two three'];

      const result = execute(tokens, 4, 11, 11);

      expect(result).toEqual({
        string: 'one **two** three',
        selectionStart: 13,
        selectionEnd: 13
      });
    });

    it('cursor at bold start', () => {
      const tokens = ['one ', '**two**', ' three'];

      const result = execute(tokens, 4, 8, 8);

      expect(result).toEqual({
        string: 'one two three',
        selectionStart: 8,
        selectionEnd: 8
      });
    });

    it('cursor at bold end', () => {
      const tokens = ['one ', '**two**', ' three'];

      const result = execute(tokens, 4, 15, 15);

      expect(result).toEqual({
        string: 'one two three',
        selectionStart: 11,
        selectionEnd: 11
      });
    });
  });
});

/**
 * Convenience function for running toggle().
 *
 * @param {String[]} tokenStrings   - Array of **bold** or regular strings
 * @param {Number}   start          - Position of start of first token
 * @param {Number}   selectionStart - Position of selection start
 * @param {Number}   selectionEnd   - Position of selection end
 */
function execute(tokenStrings, start, selectionStart, selectionEnd) {
  let position = start;
  const tokens = tokenStrings
    .map(string => {
      const bold = /^\*\*.*\*\*$/.test(string);

      const token = {
        string,
        type: bold ? `${LETTERING_CONTENT} ${LETTERING_BOLD}` : LETTERING_CONTENT,
        start: position,
        end: position + string.length
      };

      position += string.length;

      return token;
    });

  return toggle(tokens, {ch: selectionStart}, {ch: selectionEnd});
}
