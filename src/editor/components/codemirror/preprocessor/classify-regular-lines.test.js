import classifyLines from './classify';

describe('classify', () => {
  describe('regular lines', () => {
    let classifier;
    beforeEach(() => {
      classifier = classifyLines(3, 0);
    });

    [
      // just some random whatever lines
      ['pag', 3,{ type: 'regular' }],
      ['pagea', 3, { type: 'regular' }],
      ['pagesa', 3, { type: 'regular' }],
      ['spreada', 3, { type: 'regular' }],

      // other types of comic nodes
      ['Just a regular paragraph line', 3, { type: 'regular' }],
      ['key: value', 3, { type: 'regular' }],
      ['\tCAPTION: We lived that day.', 3, { type: 'regular' }],
      ['\tSFX: BLAM', 3, { type: 'regular' }],
      ['\tWONKA: You lose!', 3, { type: 'regular' }],
      ['', 3, { type: 'regular' }],
      [' ', 3, { type: 'regular' }],
    ]
      .forEach(([line, lineNumber, expected]) => {
        test(`line: "${line}"`, () => {
          const result = classifier(line, lineNumber);

          expect(result).toEqual(expected);
        });
      });
  });
});
