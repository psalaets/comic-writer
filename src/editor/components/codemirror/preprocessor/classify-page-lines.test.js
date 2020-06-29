import classifyLines from './classify';

describe('classify', () => {
  describe('page lines', () => {
    describe('cursor on same line', () => {
      cursorOnSameLineTestCases(3)
        .forEach(([line, lineNumber, expected]) => {
          test(`line: "${line}"`, () => {
            const classifier = classifyLines(3, 0);

            const result = classifier(line, lineNumber);

            expect(result).toEqual(expected);
          });
        });
    });

    describe('cursor on same line due to line offset', () => {
      cursorOnSameLineTestCases(2)
        .forEach(([line, lineNumber, expected]) => {
          test(`line: "${line}"`, () => {
            const classifier = classifyLines(3, 1);

            const result = classifier(line, lineNumber);

            expect(result).toEqual(expected);
          });
        });
    });

    describe('cursor on different line', () => {
      cursorOnDifferentLineTestCases(2)
        .forEach(([line, lineNumber, expected]) => {
          test(`line: "${line}"`, () => {
            const classifier = classifyLines(3, 0);

            const result = classifier(line, lineNumber);

            expect(result).toEqual(expected);
          });
        });
    });

    describe('cursor on different line due to line offset', () => {
      cursorOnDifferentLineTestCases(2)
        .forEach(([line, lineNumber, expected]) => {
          test(`line: "${line}"`, () => {
            const classifier = classifyLines(2, 1);

            const result = classifier(line, lineNumber);

            expect(result).toEqual(expected);
          });
        });
    });
  });
});

function cursorOnSameLineTestCases(lineNumber) {
  return [
    ['page', lineNumber, { type: 'regular' }],
    ['pages', lineNumber, { type: 'regular' }],
    ['page  ', lineNumber, { type: 'regular' }],
    ['pages  ', lineNumber, { type: 'regular' }],
    ['page 2', lineNumber, { type: 'single-page' }],
    ['page 20', lineNumber, { type: 'single-page' }],
    ['pages 2', lineNumber, { type: 'single-page' }],
    ['pages 20', lineNumber, { type: 'single-page' }],
    ['page  2', lineNumber, { type: 'single-page' }],
    ['page   20', lineNumber, { type: 'single-page' }],
    ['page 1-2', lineNumber, { type: 'multi-page', count: 2 }],
    ['pages 1-2', lineNumber, { type: 'multi-page', count: 2 }],
    ['page  2-5', lineNumber, { type: 'multi-page', count: 4 }],
    ['pages  2-5', lineNumber, { type: 'multi-page', count: 4 }],
    ['page 20-22', lineNumber, { type: 'multi-page', count: 3 }],
    ['pages 20-22', lineNumber, { type: 'multi-page', count: 3 }],

    // invalid range cases
    ['pages 22-10', lineNumber, { type: 'invalid-page-range' }],
    ['pages 5-5', lineNumber, { type: 'invalid-page-range' }],

    // partial range cases
    ['page 2-', lineNumber, { type: 'partial-page-range' }],
    ['pages 2-', lineNumber, { type: 'partial-page-range' }],
    ['page 20-', lineNumber, { type: 'partial-page-range' }],
    ['pages 20-', lineNumber, { type: 'partial-page-range' }],

    // spread keyword hasn't expanded because cursor is still on the line
    ['spread', lineNumber, { type: 'regular' }],
  ];
}

function cursorOnDifferentLineTestCases(lineNumber) {
  return [
    ['page', lineNumber, { type: 'single-page' }],
    ['pages', lineNumber, { type: 'multi-page', count: 2 }],
    ['page  ', lineNumber, { type: 'single-page' }],
    ['pages  ', lineNumber, { type: 'multi-page', count: 2 }],

    ['page 2', lineNumber, { type: 'single-page' }],
    ['page 20', lineNumber, { type: 'single-page' }],
    ['pages 2', lineNumber, { type: 'single-page' }],
    ['pages 20', lineNumber, { type: 'single-page' }],
    ['page  2', lineNumber, { type: 'single-page' }],
    ['page   20', lineNumber, { type: 'single-page' }],

    ['page 1-2', lineNumber, { type: 'multi-page', count: 2 }],
    ['pages 1-2', lineNumber, { type: 'multi-page', count: 2 }],
    ['page  2-5', lineNumber, { type: 'multi-page', count: 4 }],
    ['pages  2-5', lineNumber, { type: 'multi-page', count: 4 }],
    ['page 20-22', lineNumber, { type: 'multi-page', count: 3 }],
    ['pages 20-22', lineNumber, { type: 'multi-page', count: 3 }],

    // invalid range with cursor gone becomes a 2 pager
    ['pages 22-10', lineNumber, { type: 'multi-page', count: 2 }],
    // same to same range is a 1 pager
    ['pages 5-5', lineNumber, { type: 'single-page' }],

    // partial range with cursor gone, counts as a single page
    ['page 2-', lineNumber, { type: 'single-page' }],
    ['pages 2-', lineNumber, { type: 'single-page' }],
    ['page 20-', lineNumber, { type: 'single-page' }],
    ['pages 20-', lineNumber, { type: 'single-page' }],

    // this keyword expands when cursor has left
    ['spread', lineNumber, { type: 'multi-page', count: 2 }],
  ];
}
