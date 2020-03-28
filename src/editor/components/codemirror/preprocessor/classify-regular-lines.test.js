import classifyLines from './classify';

describe('classify', () => {
  describe('regular lines', () => {
    let classifier;
    beforeEach(() => {
      classifier = classifyLines(3, 0);
    });

    [
      // just some random whatever lines
      ['pag', 3,{ type: 'regular', line: 'pag' }],
      ['pagea', 3, { type: 'regular', line: 'pagea' }],
      ['pagesa', 3, { type: 'regular', line: 'pagesa' }],
      ['spreada', 3, { type: 'regular', line: 'spreada' }],

      // other types of comic nodes
      ['Just a regular paragraph line', 3, { type: 'regular', line: 'Just a regular paragraph line' }],
      ['key: value', 3, { type: 'regular', line: 'key: value' }],
      ['\tCAPTION: We lived that day.', 3, { type: 'regular', line: '\tCAPTION: We lived that day.' }],
      ['\tSFX: BLAM', 3, { type: 'regular', line: '\tSFX: BLAM' }],
      ['\tWONKA: You lose!', 3, { type: 'regular', line: '\tWONKA: You lose!' }],
      ['', 3, { type: 'regular', line: '' }],
      [' ', 3, { type: 'regular', line: ' ' }],
    ]
      .forEach(([line, lineNumber, expected]) => {
        test(`line: "${line}"`, () => {
          const result = classifier(line, lineNumber);

          expect(result).toEqual(expected);
        });
      });
  });
});
