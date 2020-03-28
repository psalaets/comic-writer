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
    ['page', lineNumber, { type: 'regular', line: 'page' }],
    ['pages', lineNumber, { type: 'regular', line: 'pages' }],
    ['page  ', lineNumber, { type: 'regular', line: 'page  ' }],
    ['pages  ', lineNumber, { type: 'regular', line: 'pages  ' }],
    ['page 2', lineNumber, { type: 'single-page', count: 1, line: 'page 2' }],
    ['page 20', lineNumber, { type: 'single-page', count: 1, line: 'page 20' }],
    ['pages 2', lineNumber, { type: 'single-page', count: 1, line: 'pages 2' }],
    ['pages 20', lineNumber, { type: 'single-page', count: 1, line: 'pages 20' }],
    ['page  2', lineNumber, { type: 'single-page', count: 1, line: 'page  2' }],
    ['page   20', lineNumber, { type: 'single-page', count: 1, line: 'page   20' }],
    ['page 1-2', lineNumber, { type: 'multi-page', count: 2, line: 'page 1-2' }],
    ['pages 1-2', lineNumber, { type: 'multi-page', count: 2, line: 'pages 1-2' }],
    ['page  2-5', lineNumber, { type: 'multi-page', count: 4, line: 'page  2-5' }],
    ['pages  2-5', lineNumber, { type: 'multi-page', count: 4, line: 'pages  2-5' }],
    ['page 20-22', lineNumber, { type: 'multi-page', count: 3, line: 'page 20-22' }],
    ['pages 20-22', lineNumber, { type: 'multi-page', count: 3, line: 'pages 20-22' }],

    // invalid range cases
    ['pages 22-10', lineNumber, { type: 'invalid-page-range', line: 'pages 22-10' }],
    ['pages 5-5', lineNumber, { type: 'invalid-page-range', line: 'pages 5-5' }],

    // partial range cases
    ['page 2-', lineNumber, { type: 'partial-page-range', line: 'page 2-' }],
    ['pages 2-', lineNumber, { type: 'partial-page-range', line: 'pages 2-' }],
    ['page 20-', lineNumber, { type: 'partial-page-range', line: 'page 20-' }],
    ['pages 20-', lineNumber, { type: 'partial-page-range', line: 'pages 20-' }],

    // spread keyword hasn't expanded because cursor is still on the line
    ['spread', lineNumber, { type: 'regular', line: 'spread' }],
  ];
}

function cursorOnDifferentLineTestCases(lineNumber) {
  return [
    ['page', lineNumber, { type: 'single-page', count: 1, line: 'page' }],
    ['pages', lineNumber, { type: 'multi-page', count: 2, line: 'pages' }],
    ['page  ', lineNumber, { type: 'single-page', count: 1, line: 'page  ' }],
    ['pages  ', lineNumber, { type: 'multi-page', count: 2, line: 'pages  ' }],

    ['page 2', lineNumber, { type: 'single-page', count: 1, line: 'page 2' }],
    ['page 20', lineNumber, { type: 'single-page', count: 1, line: 'page 20' }],
    ['pages 2', lineNumber, { type: 'single-page', count: 1, line: 'pages 2' }],
    ['pages 20', lineNumber, { type: 'single-page', count: 1, line: 'pages 20' }],
    ['page  2', lineNumber, { type: 'single-page', count: 1, line: 'page  2' }],
    ['page   20', lineNumber, { type: 'single-page', count: 1, line: 'page   20' }],

    ['page 1-2', lineNumber, { type: 'multi-page', count: 2, line: 'page 1-2' }],
    ['pages 1-2', lineNumber, { type: 'multi-page', count: 2, line: 'pages 1-2' }],
    ['page  2-5', lineNumber, { type: 'multi-page', count: 4, line: 'page  2-5' }],
    ['pages  2-5', lineNumber, { type: 'multi-page', count: 4, line: 'pages  2-5' }],
    ['page 20-22', lineNumber, { type: 'multi-page', count: 3, line: 'page 20-22' }],
    ['pages 20-22', lineNumber, { type: 'multi-page', count: 3, line: 'pages 20-22' }],

    // invalid range with cursor gone becomes a 2 pager
    ['pages 22-10', lineNumber, { type: 'multi-page', count: 2, line: 'pages 22-10' }],
    // same to same range is a 1 pager
    ['pages 5-5', lineNumber, { type: 'single-page', count: 1, line: 'pages 5-5' }],

    // partial range with cursor gone, counts as a single page
    ['page 2-', lineNumber, { type: 'single-page', count: 1, line: 'page 2-' }],
    ['pages 2-', lineNumber, { type: 'single-page', count: 1, line: 'pages 2-' }],
    ['page 20-', lineNumber, { type: 'single-page', count: 1, line: 'page 20-' }],
    ['pages 20-', lineNumber, { type: 'single-page', count: 1, line: 'pages 20-' }],

    // this keyword expands when cursor has left
    ['spread', lineNumber, { type: 'multi-page', count: 2, line: 'spread' }],
  ];
}
