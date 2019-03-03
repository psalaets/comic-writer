import {
  LETTERING_CONTENT,
  LETTERING_BOLD,
} from '../comic-writer-mode/token';

import { toggle } from './toggle-bold';

describe('toggle()', () => {
  describe('bold token', () => {
    test('front selected', () => {
      const tokens = [
        bold(4, 12, '**blah**')
      ];

      const modified = toggle(tokens, selection(4), selection(8));

      expect(modified).toEqual(
        [
          nonBold(4, 6, 'bl'),
          bold(6, 12, '**ah**')
        ]
      );
    });

    test('back selected', () => {
      const tokens = [
        bold(4, 12, '**blah**')
      ];

      const modified = toggle(tokens, selection(8), selection(12));

      expect(modified).toEqual(
        [
          bold(4, 10, '**bl**'),
          nonBold(10, 12, 'ah')
        ]
      );
    });

    test('middle selected', () => {
      const tokens = [
        bold(4, 12, '**blah**')
      ];

      const modified = toggle(tokens, selection(7), selection(9));

      expect(modified).toEqual(
        [
          bold(4, 9, '**b**'),
          nonBold(9, 11, 'la'),
          bold(11, 16, '**h**'),
        ]
      );
    });

    test('all selected', () => {
      const tokens = [
        bold(4, 12, '**blah**')
      ];

      const modified = toggle(tokens, selection(4), selection(12));

      expect(modified).toEqual(
        [
          nonBold(4, 8, 'blah')
        ]
      );
    });
  });

  describe('non-bold token', () => {
    test('all selected', () => {
      const tokens = [
        nonBold(4, 8, 'blah')
      ];

      const modified = toggle(tokens, selection(4), selection(8));

      expect(modified).toEqual(
        [
          bold(4, 12, '**blah**')
        ]
      );
    });

    test('front selected', () => {
      const tokens = [
        bold(4, 8, 'blah')
      ];

      const modified = toggle(tokens, selection(4), selection(6));

      expect(modified).toEqual(
        [
          bold(4, 10, '**bl**'),
          nonBold(10, 12, 'ah')
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