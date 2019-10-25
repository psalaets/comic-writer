import classifyLines from './classify-lines';

describe('classify lines', () => {
  describe('page shorthands', () => {
    describe('cursor on same line', () => {
      [
        ['page', 'regular', undefined],
        ['pages', 'regular', undefined],
        ['page  ', 'regular', undefined],
        ['pages  ', 'regular', undefined],
        ['page 2', 'single-page', 1],
        ['page 20', 'single-page', 1],
        ['pages 2', 'single-page', 1],
        ['pages 20', 'single-page', 1],
        ['page  2', 'single-page', 1],
        ['page   20', 'single-page', 1],

        ['page 1-2', 'multi-page', 2],
        ['pages 1-2', 'multi-page', 2],
        ['page  2-5', 'multi-page', 4],
        ['pages  2-5', 'multi-page', 4],
        ['page 20-22', 'multi-page', 3],
        ['pages 20-22', 'multi-page', 3],

        // invalid range with cursor still there is like 1 page
        ['pages 22-10', 'single-page', 1],
        // same to same range is 1 page
        ['pages 5-5', 'single-page', 1],

        ['page 2-', 'partial-page-range', undefined],
        ['pages 2-', 'partial-page-range', undefined],
        ['page 20-', 'partial-page-range', undefined],
        ['pages 20-', 'partial-page-range', undefined],

        ['spread', 'regular', undefined],
      ]
        .map(testCase => testCase.concat([3, 3]))
        .forEach(defineTestCase);
    });

    describe('cursor on different line', () => {
      [
        ['page', 'single-page', 1],
        ['pages', 'multi-page', 2],
        ['page  ', 'single-page', 1],
        ['pages  ', 'multi-page', 2],

        ['page 2', 'single-page', 1],
        ['page 20', 'single-page', 1],
        ['pages 2', 'single-page', 1],
        ['pages 20', 'single-page', 1],
        ['page  2', 'single-page', 1],
        ['page   20', 'single-page', 1],

        ['page 1-2', 'multi-page', 2],
        ['pages 1-2', 'multi-page', 2],
        ['page  2-5', 'multi-page', 4],
        ['pages  2-5', 'multi-page', 4],
        ['page 20-22', 'multi-page', 3],
        ['pages 20-22', 'multi-page', 3],

        // invalid range with cursor gone becomes a 2 pager
        ['pages 22-10', 'multi-page', 2],
        // same to same range is a 1 pager
        ['pages 5-5', 'single-page', 1],

        ['page 2-', 'single-page', 1],
        ['pages 2-', 'single-page', 1],
        ['page 20-', 'single-page', 1],
        ['pages 20-', 'single-page', 1],

        ['spread', 'multi-page', 2],
      ]
        .map(testCase => testCase.concat([2, 3]))
        .forEach(defineTestCase);
    });

    describe('non-page, non-panels', () => {
      [
        ['pag', 'regular', undefined],
        ['pagea', 'regular', undefined],
        ['pagesa', 'regular', undefined],
        ['asdf', 'regular', undefined],
      ]
        .map(testCase => testCase.concat([3, 3]))
        .forEach(defineTestCase);
    });
  });
});

function defineTestCase([line, type, count, lineNumber, cursorLine]) {
  test(line, () => {
    const result = classifyLines(cursorLine)(line, lineNumber);

    expect(result).toEqual({
      line,
      count,
      type
    });
  });
}
