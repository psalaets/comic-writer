import {
  LETTERING_CONTENT,
  LETTERING_BOLD,
} from '../comic-writer-mode/token';

import { toggle } from './toggle-bold';

describe('toggle()', () => {
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