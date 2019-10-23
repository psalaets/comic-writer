import classifyLines from './classify-lines';

describe('classify lines', () => {
  describe('page shorthands', () => {
    describe('cursor on same line', () => {
      [
        ['page', 'regular', undefined],
        ['pages', 'regular', undefined],
        ['page  ', 'regular', undefined],
        ['pages  ', 'regular', undefined],
        ['page 2', 'page', 1],
        ['page 20', 'page', 1],
        ['pages 2', 'page', 1],
        ['pages 20', 'page', 1],
        ['page  2', 'page', 1],
        ['page   20', 'page', 1],

        ['page 1-2', 'page', 2],
        ['pages 1-2', 'page', 2],
        ['page  2-5', 'page', 4],
        ['pages  2-5', 'page', 4],
        ['page 20-22', 'page', 3],
        ['pages 20-22', 'page', 3],

        // invalid range becomes a 2 pager
        ['pages 22-10', 'page', 2],
        // same to same range is a 1 pager
        ['pages 5-5', 'page', 1],

        ['page 2-', 'page', 1],
        ['pages 2-', 'page', 1],
        ['page 20-', 'page', 1],
        ['pages 20-', 'page', 1],
      ]
        .map(testCase => testCase.concat([3, 3]))
        .forEach(defineTestCase);
    });

    describe('cursor on different line', () => {
      [
        ['page', 'page', 1],
        ['pages', 'page', 2],
        ['page  ', 'page', 1],
        ['pages  ', 'page', 2],

        ['page 2', 'page', 1],
        ['page 20', 'page', 1],
        ['pages 2', 'page', 1],
        ['pages 20', 'page', 1],
        ['page  2', 'page', 1],
        ['page   20', 'page', 1],

        ['page 1-2', 'page', 2],
        ['pages 1-2', 'page', 2],
        ['page  2-5', 'page', 4],
        ['pages  2-5', 'page', 4],
        ['page 20-22', 'page', 3],
        ['pages 20-22', 'page', 3],

        // invalid range becomes a 2 pager
        ['pages 22-10', 'page', 2],
        // same to same range is a 1 pager
        ['pages 5-5', 'page', 1],

        ['page 2-', 'page', 1],
        ['pages 2-', 'page', 1],
        ['page 20-', 'page', 1],
        ['pages 20-', 'page', 1],
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
