import classifyLines from './classify';

describe('classify', () => {
  describe('panel lines', () => {
    let classifier;
    beforeEach(() => {
      classifier = classifyLines(3, 0);
    });

    [
      // cursor still on this line
      ['panel', 3, { type: 'regular' }],
      ['panel 4', 3, { type: 'panel' }],
      ['panel 4 blah', 3, { type: 'regular' }],
      // cursor not on this line
      ['panel', 2, { type: 'panel' }],
      ['panel 4', 2, { type: 'panel' }],
      ['panel 4 blah', 2, { type: 'regular' }],
    ]
      .forEach(([line, lineNumber, expected]) => {
        test(`line: "${line}"`, () => {
          const result = classifier(line, lineNumber);

          expect(result).toEqual(expected);
        });
      });
  });
});
