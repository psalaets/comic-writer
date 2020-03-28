import classifyLines from './classify';

describe('classify', () => {
  describe('page lines', () => {
    describe('cursor on same line', () => {
      let classifier;
      beforeEach(() => {
        classifier = classifyLines(3, 0);
      });

      [
        ['page', 3, { type: 'regular', line: 'page' }],
        ['pages', 3, { type: 'regular', line: 'pages' }],
        ['page  ', 3, { type: 'regular', line: 'page  ' }],
        ['pages  ', 3, { type: 'regular', line: 'pages  ' }],
        ['page 2', 3, { type: 'single-page', count: 1, line: 'page 2' }],
        ['page 20', 3, { type: 'single-page', count: 1, line: 'page 20' }],
        ['pages 2', 3, { type: 'single-page', count: 1, line: 'pages 2' }],
        ['pages 20', 3, { type: 'single-page', count: 1, line: 'pages 20' }],
        ['page  2', 3, { type: 'single-page', count: 1, line: 'page  2' }],
        ['page   20', 3, { type: 'single-page', count: 1, line: 'page   20' }],
        ['page 1-2', 3, { type: 'multi-page', count: 2, line: 'page 1-2' }],
        ['pages 1-2', 3, { type: 'multi-page', count: 2, line: 'pages 1-2' }],
        ['page  2-5', 3, { type: 'multi-page', count: 4, line: 'page  2-5' }],
        ['pages  2-5', 3, { type: 'multi-page', count: 4, line: 'pages  2-5' }],
        ['page 20-22', 3, { type: 'multi-page', count: 3, line: 'page 20-22' }],
        ['pages 20-22', 3, { type: 'multi-page', count: 3, line: 'pages 20-22' }],

        // invalid range cases
        ['pages 22-10', 3, { type: 'invalid-page-range', line: 'pages 22-10' }],
        ['pages 5-5', 3, { type: 'invalid-page-range', line: 'pages 5-5' }],

        // partial range cases
        ['page 2-', 3, { type: 'partial-page-range', line: 'page 2-' }],
        ['pages 2-', 3, { type: 'partial-page-range', line: 'pages 2-' }],
        ['page 20-', 3, { type: 'partial-page-range', line: 'page 20-' }],
        ['pages 20-', 3, { type: 'partial-page-range', line: 'pages 20-' }],

        // spread keyword hasn't expanded because cursor is still on the line
        ['spread', 3, { type: 'regular', line: 'spread' }],
      ]
        .forEach(([line, lineNumber, expected]) => {
          test(`line: "${line}"`, () => {
            const result = classifier(line, lineNumber);

            expect(result).toEqual(expected);
          });
        });
    });

    describe('cursor on different line', () => {
      let classifier;
      beforeEach(() => {
        classifier = classifyLines(3, 0);
      });

      [
        ['page', 2, { type: 'single-page', count: 1, line: 'page' }],
        ['pages', 2, { type: 'multi-page', count: 2, line: 'pages' }],
        ['page  ', 2, { type: 'single-page', count: 1, line: 'page  ' }],
        ['pages  ', 2, { type: 'multi-page', count: 2, line: 'pages  ' }],

        ['page 2', 2, { type: 'single-page', count: 1, line: 'page 2' }],
        ['page 20', 2, { type: 'single-page', count: 1, line: 'page 20' }],
        ['pages 2', 2, { type: 'single-page', count: 1, line: 'pages 2' }],
        ['pages 20', 2, { type: 'single-page', count: 1, line: 'pages 20' }],
        ['page  2', 2, { type: 'single-page', count: 1, line: 'page  2' }],
        ['page   20', 2, { type: 'single-page', count: 1, line: 'page   20' }],

        ['page 1-2', 2, { type: 'multi-page', count: 2, line: 'page 1-2' }],
        ['pages 1-2', 2, { type: 'multi-page', count: 2, line: 'pages 1-2' }],
        ['page  2-5', 2, { type: 'multi-page', count: 4, line: 'page  2-5' }],
        ['pages  2-5', 2, { type: 'multi-page', count: 4, line: 'pages  2-5' }],
        ['page 20-22', 2, { type: 'multi-page', count: 3, line: 'page 20-22' }],
        ['pages 20-22', 2, { type: 'multi-page', count: 3, line: 'pages 20-22' }],

        // invalid range with cursor gone becomes a 2 pager
        ['pages 22-10', 2, { type: 'multi-page', count: 2, line: 'pages 22-10' }],
        // same to same range is a 1 pager
        ['pages 5-5', 2, { type: 'single-page', count: 1, line: 'pages 5-5' }],

        // partial range with cursor gone, counts as a single page
        ['page 2-', 2, { type: 'single-page', count: 1, line: 'page 2-' }],
        ['pages 2-', 2, { type: 'single-page', count: 1, line: 'pages 2-' }],
        ['page 20-', 2, { type: 'single-page', count: 1, line: 'page 20-' }],
        ['pages 20-', 2, { type: 'single-page', count: 1, line: 'pages 20-' }],

        // this keyword expands when cursor has left
        ['spread', 2, { type: 'multi-page', count: 2, line: 'spread' }],
      ]
        .forEach(([line, lineNumber, expected]) => {
          test(`line: "${line}"`, () => {
            const result = classifier(line, lineNumber);

            expect(result).toEqual(expected);
          });
        });
    });
  });
});
