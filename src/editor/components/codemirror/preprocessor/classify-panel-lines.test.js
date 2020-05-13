import classifyLines from './classify';

describe('classify', () => {
  describe('panel lines', () => {
    let classifier;
    beforeEach(() => {
      classifier = classifyLines(3, 0);
    });

    [
      ['panel', 3, { type: 'regular', line: 'panel' }],
      ['panel 4', 3, { type: 'panel', line: 'panel 4' }],
      ['panel', 2, { type: 'panel', line: 'panel' }],
      ['panel 4', 2, { type: 'panel', line: 'panel 4' }],
    ]
      .forEach(([line, lineNumber, expected]) => {
        test(`line: "${line}"`, () => {
          const result = classifier(line, lineNumber);

          expect(result).toEqual(expected);
        });
      });
  });
});
