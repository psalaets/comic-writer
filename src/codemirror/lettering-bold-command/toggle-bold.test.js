import {
  LETTERING_CONTENT,
  LETTERING_BOLD,
} from '../comic-writer-mode/token';

import { toggle } from './toggle-bold';

describe('toggle()', () => {
  describe('no tokens', () => {
    test('just a cursor', () => {
      const tokens = [];

      const modified = toggle(tokens, selection(0), selection(0));

      expect(modified).toEqual(
        [
          bold(0, 4, '****')
        ]
      );
    });
  });

  describe('one non-bold word', () => {
    test('fully selected', () => {
      const tokens = [
        nonBold(4, 7, 'one')
      ];

      const modified = toggle(tokens, selection(4), selection(7));

      expect(modified).toEqual(
        [
          bold(4, 11, '**one**')
        ]
      );
    });

    test('only front selected', () => {
      const tokens = [
        nonBold(4, 7, 'one')
      ];

      const modified = toggle(tokens, selection(4), selection(6));

      expect(modified).toEqual(
        [
          bold(4, 11, '**one**')
        ]
      );
    });

    test('only back selected', () => {
      const tokens = [
        nonBold(4, 7, 'one')
      ];

      const modified = toggle(tokens, selection(5), selection(7));

      expect(modified).toEqual(
        [
          bold(4, 11, '**one**')
        ]
      );
    });

    test('only middle selected', () => {
      const tokens = [
        nonBold(4, 7, 'one')
      ];

      const modified = toggle(tokens, selection(5), selection(6));

      expect(modified).toEqual(
        [
          bold(4, 11, '**one**')
        ]
      );
    });

    test('just cursor on token', () => {
      const tokens = [
        nonBold(4, 7, 'one')
      ];

      const modified = toggle(tokens, selection(5), selection(5));

      expect(modified).toEqual(
        [
          bold(4, 11, '**one**')
        ]
      );
    });

    test('no cursor overlap', () => {
      const tokens = [
        nonBold(4, 7, 'one')
      ];

      const modified = toggle(tokens, selection(10), selection(17));

      expect(modified).toEqual(
        [
          nonBold(4, 7, 'one')
        ]
      );
    });
  });

  describe('multiple non-bold words', () => {
    test('just a cursor on a word', () => {
      const tokens = [
        nonBold(4, 17, 'one two three')
      ];

      const modified = toggle(tokens, selection(5), selection(5));

      expect(modified).toEqual(
        [
          bold(4, 11, '**one**'),
          nonBold(11, 21, ' two three')
        ]
      );
    });

    test('just a cursor in whitespace', () => {
      const tokens = [
        nonBold(4, 12, 'one  two')
      ];

      const modified = toggle(tokens, selection(8), selection(8));

      expect(modified).toEqual(
        [
          nonBold(4, 8, 'one '),
          bold(8, 12, '****'),
          nonBold(12, 16, ' two')
        ]
      );
    });

    test('all fully selected', () => {
      const tokens = [
        nonBold(4, 17, 'one two three')
      ];

      const modified = toggle(tokens, selection(4), selection(17));

      expect(modified).toEqual(
        [
          bold(4, 21, '**one two three**')
        ]
      );
    });

    test('some fully selected', () => {
      const tokens = [
        nonBold(4, 17, 'one two three')
      ];

      const modified = toggle(tokens, selection(8), selection(17));

      expect(modified).toEqual(
        [
          nonBold(4, 8, 'one '),
          bold(8, 21, '**two three**')
        ]
      );
    });

    test('one fully selected', () => {
      const tokens = [
        nonBold(4, 17, 'one two three')
      ];

      const modified = toggle(tokens, selection(8), selection(11));

      expect(modified).toEqual(
        [
          nonBold(4, 8, 'one '),
          bold(8, 15, '**two**'),
          nonBold(15, 21, ' three'),
        ]
      );
    });
  });

  describe('one bold word', () => {
    test('fully selected', () => {
      const tokens = [
        bold(4, 11, '**one**')
      ];

      const modified = toggle(tokens, selection(4), selection(11));

      expect(modified).toEqual(
        [
          nonBold(4, 7, 'one')
        ]
      );
    });

    test('only front selected', () => {
      const tokens = [
        bold(4, 11, '**one**')
      ];

      const modified = toggle(tokens, selection(4), selection(7));

      expect(modified).toEqual(
        [
          nonBold(4, 7, 'one')
        ]
      );
    });

    test('only back selected', () => {
      const tokens = [
        bold(4, 11, '**one**')
      ];

      const modified = toggle(tokens, selection(8), selection(11));

      expect(modified).toEqual(
        [
          nonBold(4, 7, 'one')
        ]
      );
    });

    test('only middle selected', () => {
      const tokens = [
        bold(4, 11, '**one**')
      ];

      const modified = toggle(tokens, selection(6), selection(8));

      expect(modified).toEqual(
        [
          nonBold(4, 7, 'one')
        ]
      );
    });

    test('just cursor on token', () => {
      const tokens = [
        bold(4, 11, '**one**')
      ];

      const modified = toggle(tokens, selection(7), selection(7));

      expect(modified).toEqual(
        [
          nonBold(4, 7, 'one')
        ]
      );
    });

    test('no cursor overlap', () => {
      const tokens = [
        bold(4, 11, '**one**')
      ];

      const modified = toggle(tokens, selection(15), selection(17));

      expect(modified).toEqual(
        [
          bold(4, 11, '**one**')
        ]
      );
    });
  });

  describe('multiple bold words', () => {
    test('just a cursor on a word', () => {
      const tokens = [
        bold(4, 21, '**one two three**')
      ];

      const modified = toggle(tokens, selection(7), selection(7));

      expect(modified).toEqual(
        [
          nonBold(4, 17, 'one two three')
        ]
      );
    });

    test('just a cursor in whitespace', () => {
      const tokens = [
        bold(4, 16, '**one  two**')
      ];

      const modified = toggle(tokens, selection(10), selection(10));

      expect(modified).toEqual(
        [
          nonBold(4, 12, 'one  two')
        ]
      );
    });

    test('all fully selected', () => {
      const tokens = [
        bold(4, 21, '**one two three**')
      ];

      const modified = toggle(tokens, selection(4), selection(21));

      expect(modified).toEqual(
        [
          nonBold(4, 17, 'one two three')
        ]
      );
    });

    test('some fully selected', () => {
      const tokens = [
        bold(4, 21, '**one two three**')
      ];

      const modified = toggle(tokens, selection(4), selection(13));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(10), selection(13));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(4), selection(16));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(7), selection(14));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(4), selection(12));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(13), selection(16));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(4), selection(26));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(7), selection(22));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(13), selection(16));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(7), selection(16));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(13), selection(16));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(15), selection(18));

      expect(modified).toEqual(
        [
          bold(4, 18, '**bold   not**')
        ]
      );
    });

    test('1 space between bold and non bold', () => {
      const tokens = [
        nonBold(4, 12, 'soon not')
      ];

      const modified = toggle(tokens, selection(4), selection(9));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(4), selection(9));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(7), selection(12));

      expect(modified).toEqual(
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

      const modified = toggle(tokens, selection(7), selection(12));

      expect(modified).toEqual(
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