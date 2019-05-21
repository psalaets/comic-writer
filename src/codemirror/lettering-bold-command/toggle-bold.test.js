import {
  LETTERING_CONTENT,
  LETTERING_BOLD,
} from '../comic-writer-mode/token';

import { toggle } from './toggle-bold';

describe.skip('toggle()', () => {
  describe('no tokens', () => {
    test('just a cursor', () => {
      const tokens = [];

      const result = execute(tokens, 0, 0, 0);

      expect(result).toEqual({
        string: '****',
        selectionStart: 0,
        selectionEnd: 0
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

      const result = toggle(tokens, 4, 4, 6);

      expect(result).toEqual({
        string: '**one**',
        selectionStart: 6,
        selectionEnd: 8
      });
    });

    test('only back selected', () => {
      const tokens = ['one'];

      const result = toggle(tokens, 4, 5, 7);

      expect(result).toEqual({
        string: '**one**',
        selectionStart: 7,
        selectionEnd: 9
      });
    });

    test('only middle selected', () => {
      const tokens = ['one'];

      const result = toggle(tokens, 4, 5, 6);

      expect(result).toEqual({
        string: '**one**',
        selectionStart: 5,
        selectionEnd: 6
      });
    });

    test('just cursor on token', () => {
      const tokens = ['one'];

      const result = toggle(tokens, 4, 5, 5);

      expect(result).toEqual({
        string: '**one**',
        selectionStart: 7,
        selectionEnd: 7
      });
    });

    test('no cursor overlap', () => {
      const tokens = ['one'];

      const result = toggle(tokens, 4, 10, 17);

      expect(result).toEqual({
        string: 'one',
        selectionStart: 10,
        selectionEnd: 17
      });
    });
  });

  describe('multiple non-bold words', () => {
    test('just a cursor on a word', () => {
      const tokens = ['one two three'];

      const result = toggle(tokens, 4, 5, 5);

      expect(result).toEqual({
        string: '**one** two three',
        selectionStart: 7,
        selectionEnd: 7
      });
    });

    test('just a cursor in whitespace', () => {
      const tokens = ['one  two'];

      const result = toggle(tokens, 4, 8, 8);

      expect(result).toEqual({
        string: 'one **** two',
        selectionStart: 10,
        selectionEnd: 10
      });
    });

    test('all fully selected', () => {
      const tokens = ['one two three'];

      const result = toggle(tokens, 4, 4, 17);

      expect(result).toEqual({
        string: '**one two three**',
        selectionStart: 6,
        selectionEnd: 19
      });
    });

    test('some fully selected', () => {
      const tokens = ['one two three'];

      const result = toggle(tokens, 4, 8, 17);

      expect(result).toEqual({
        string: 'one **two three**',
        selectionStart: 10,
        selectionEnd: 19
      });
    });

    test('one fully selected', () => {
      const tokens = ['one two three'];

      const result = toggle(tokens, 4, 8, 11);

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

      const result = toggle(tokens, 4, 4, 11);

      expect(result).toEqual({
        string: 'one',
        selectionStart: 4,
        selectionEnd: 7
      });
    });

    test('only front selected', () => {
      const tokens = ['**one**'];

      const result = toggle(tokens, 4, 4, 7);

      expect(result).toEqual({
        string: 'one',
        selectionStart: 4,
        selectionEnd: 5
      });
    });

    test('only back selected', () => {
      const tokens = ['**one**'];

      const result = toggle(tokens, 4, 8, 11);

      expect(result).toEqual({
        string: 'one',
        selectionStart: 6,
        selectionEnd: 6
      });
    });

    test('only middle selected', () => {
      const tokens = ['**one**'];

      const result = toggle(tokens, 4, 7, 8);

      expect(result).toEqual({
        string: 'one',
        selectionStart: 5,
        selectionEnd: 6
      });
    });

    test('just cursor on token', () => {
      const tokens = ['**one**'];

      const result = toggle(tokens, 4, 7, 7);

      expect(result).toEqual({
        string: 'one',
        selectionStart: 5,
        selectionEnd: 5
      });
    });

    test('no cursor overlap', () => {
      const tokens = ['**one**'];

      const result = toggle(tokens, 7, 15, 17);

      expect(result).toEqual({
        string: '**one**',
        selectionStart: 15,
        selectionEnd: 17
      });
    });
  });

  describe('multiple bold words', () => {
    test('just a cursor on a word', () => {
      const tokens = [
        bold(4, 21, '**one two three**')
      ];

      const result = toggle(tokens, 7, 7);

      expect(result).toEqual(
        [
          nonBold(4, 8, 'one '),
          bold(8, 21, '**two three**')
        ]
      );
    });

    test('just a cursor in whitespace', () => {
      const tokens = [
        bold(4, 16, '**one  two**')
      ];

      const result = toggle(tokens, 10, 10);

      expect(result).toEqual(
        [
          bold(4, 16, '**one  two**')
        ]
      );
    });

    test('all fully selected', () => {
      const tokens = [
        bold(4, 21, '**one two three**')
      ];

      const result = toggle(tokens, 4, 21);

      expect(result).toEqual(
        [
          nonBold(4, 17, 'one two three')
        ]
      );
    });

    test('some fully selected', () => {
      const tokens = [
        bold(4, 21, '**one two three**')
      ];

      const result = toggle(tokens, 4, 13);

      expect(result).toEqual(
        [
          nonBold(4, 12, 'one two '),
          bold(12, 21, '**three**')
        ]
      );
    });

    test('one fully selected', () => {
      const tokens = [
        bold(4, 21, '**one two three**')
      ];

      const result = toggle(tokens, 10, 13);

      expect(result).toEqual(
        [
          bold(4, 11, '**one**'),
          nonBold(11, 16, ' two '),
          bold(16, 25, '**three**'),
        ]
      );
    });
  });

  describe('mixed tokens: bold, not bold', () => {
    test('all fully selected', () => {
      const tokens = [
        bold(4, 12, '**bold**'),
        nonBold(12, 16, ' not')
      ];

      const result = toggle(tokens, 4, 16);

      expect(result).toEqual(
        [
          bold(4, 16, '**bold not**')
        ]
      );
    });

    test('all partially selected', () => {
      const tokens = [
        bold(4, 12, '**bold**'),
        nonBold(12, 16, ' not')
      ];

      const result = toggle(tokens, 7, 14);

      expect(result).toEqual(
        [
          bold(4, 16, '**bold not**')
        ]
      );
    });

    test('bold fully selected', () => {
      const tokens = [
        bold(4, 12, '**bold**'),
        nonBold(12, 16, ' not')
      ];

      const result = toggle(tokens, 4, 12);

      expect(result).toEqual(
        [
          nonBold(4, 12, 'bold not')
        ]
      );
    });

    test('non bold fully selected', () => {
      const tokens = [
        bold(4, 12, '**bold**'),
        nonBold(12, 16, ' not')
      ];

      const result = toggle(tokens, 13, 16);

      expect(result).toEqual(
        [
          bold(4, 16, '**bold not**')
        ]
      );
    });
  });

  describe('mixed tokens: bold, not bold, bold', () => {
    test('all fully selected', () => {
      const tokens = [
        bold(4, 12, '**bold**'),
        nonBold(12, 17, ' not '),
        bold(17, 26, '**bold**')
      ];

      const result = toggle(tokens, 4, 26);

      expect(result).toEqual(
        [
          bold(4, 21, '**bold not bold**')
        ]
      );
    });

    test('ends partially selected', () => {
      const tokens = [
        bold(4, 12, '**bold**'),
        nonBold(12, 17, ' not '),
        bold(17, 26, '**bold**')
      ];

      const result = toggle(tokens, 7, 22);

      expect(result).toEqual(
        [
          bold(4, 21, '**bold not bold**')
        ]
      );
    });

    test('middle fully selected', () => {
      const tokens = [
        bold(4, 12, '**bold**'),
        nonBold(12, 17, ' not '),
        bold(17, 26, '**bold**')
      ];

      const result = toggle(tokens, 13, 16);

      expect(result).toEqual(
        [
          bold(4, 21, '**bold not bold**')
        ]
      );
    });

    test('non bold partially selected', () => {
      const tokens = [
        bold(4, 12, '**bold**'),
        nonBold(12, 22, ' not here '),
        bold(22, 30, '**bold**')
      ];

      const result = toggle(tokens, 7, 16);

      expect(result).toEqual(
        [
          bold(4, 16, '**bold not**'),
          nonBold(16, 22, ' here '),
          bold(22, 30, '**bold**'),
        ]
      );
    });
  });

  describe('space between tokens', () => {
    test('1 space between bolds', () => {
      const tokens = [
        bold(4, 12, '**bold**'),
        nonBold(12, 16, ' not')
      ];

      const result = toggle(tokens, 13, 16);

      expect(result).toEqual(
        [
          bold(4, 16, '**bold not**')
        ]
      );
    });

    test('some spaces between bolds', () => {
      const tokens = [
        bold(4, 12, '**bold**'),
        nonBold(12, 16, '   not')
      ];

      const result = toggle(tokens, 15, 18);

      expect(result).toEqual(
        [
          bold(4, 18, '**bold   not**')
        ]
      );
    });

    test('1 space between bold and non bold', () => {
      const tokens = [
        nonBold(4, 12, 'soon not')
      ];

      const result = toggle(tokens, 4, 9);

      expect(result).toEqual(
        [
          bold(4, 12, '**soon**'),
          nonBold(12, 16, ' not')
        ]
      );
    });

    test('some spaces between bold and non bold', () => {
      const tokens = [
        nonBold(4, 14, 'soon   not')
      ];

      const result = toggle(tokens, 4, 9);

      expect(result).toEqual(
        [
          bold(4, 12, '**soon**'),
          nonBold(12, 18, '   not')
        ]
      );
    });

    test('1 space between non bold and bold', () => {
      const tokens = [
        nonBold(4, 12, 'not soon')
      ];

      const result = toggle(tokens, 7, 12);

      expect(result).toEqual(
        [
          nonBold(4, 8, 'not '),
          bold(8, 16, '**soon**'),
        ]
      );
    });

    test('some spaces between non bold and bold', () => {
      const tokens = [
        nonBold(4, 14, 'not   soon')
      ];

      const result = toggle(tokens, 7, 12);

      expect(result).toEqual(
        [
          nonBold(4, 10, 'not   '),
          bold(10, 18, '**soon**'),
        ]
      );
    });
  });

  /*
empty bold doesn't merge into whitespace separated bold token

cursor at non/bold boundary
cursor at bold/non boundary
cursor at start string, at non
cursor at start string, at bold
cursor at end string, at non
cursor at end string, at bold

all: calc and set cursor position
*/

});

function bold(start, end, string) {
  return token(start, end, string, `${LETTERING_BOLD} ${LETTERING_CONTENT}`);
}

function nonBold(start, end, string) {
  return token(start, end, string, `${LETTERING_CONTENT}`);
}

function token(start, end, string, type) {
  return {
    start, end, string, type
  };
}

function selection(ch, line = 5) {
  return {
    ch,
    line
  };
}

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
      const bold = /^\*\*.?\*\*$/.test(string);

      const token = {
        string,
        type: bold ? LETTERING_CONTENT : `${LETTERING_CONTENT} ${LETTERING_BOLD}`,
        start: position,
        end: position + string.length
      };

      position += string.length;

      return token;
    });

  return toggle(tokens, {ch: selectionStart}, {ch: selectionEnd});
}