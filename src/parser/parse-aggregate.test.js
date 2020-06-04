import {
  parseSpreadContent,
  parsePreSpreadLines
} from './parse';

describe('parse aggregate', () => {
  describe('parseRawSpreadChunk', () => {
    test('basic', () => {
      const spreadLine = 'Page 1';
      const childLines = [
        'Panel 1',
        'Establihsing shot of Manhattan. There is a helicopter hovering above a skyscraper.'
      ];

      const result = parseSpreadContent({
        spread: spreadLine,
        children: childLines
      });

      expect(result).toMatchSnapshot();
    });

    test('multiple panels', () => {
      const spreadLine = 'Page 1';
      const childLines = [
        'Panel 1',
        'Establihsing shot of Manhattan. There is a helicopter hovering above a skyscraper.',
        '',
        'Panel 2',
        'The character walks down the street. Hands stuffed in pockets.',
        '',
        'Panel 3',
        'Character looks behind him, thinking he is being followed.',
        ''
      ];

      const result = parseSpreadContent({
        spread: spreadLine,
        children: childLines
      });

      expect(result).toMatchSnapshot();
    });

    test('multiple letterings', () => {
      const spreadLine = 'Page 1';
      const childLines = [
        'Panel 1',
        'Establihsing shot of NYC. There is a helicopter hovering above a skyscraper.',
        '',
        'Panel 2',
        'The character walks down the street. Hands stuffed in pockets.',
        '\tCAPTION: They\'re coming after me. I can feel it.',
        '\tCAPTION: Am I paranoid?',
        '',
        'Panel 3',
        'Character looks behind him, thinking he is being followed.',
        '\tCAPTION: I like to call it prepared.',
        '',
        'Panel 4',
        'Character running frantically.',
        '\tCHARACTER: Help! Help!',
        '\tCAPTION: Nobody cares, not here.',
        'Panel 5',
        'Character is shot in the back.',
        '\tSFX: BLAM!',
        '\tCAPTION: Bout damn time.'
      ];

      const result = parseSpreadContent({
        spread: spreadLine,
        children: childLines
      });

      expect(result).toMatchSnapshot();
    });
  });

  describe('parsePreSpreadLines', () => {
    test('metadata, blank lines and paragraphs', () => {
      const lines = [
        'Title: The Comic',
        '',
        'This is a comic about some people. It is my first comic.',
        '',
        'Issue: 5',
        ''
      ];

      const result = parsePreSpreadLines(lines);

      expect(result).toMatchSnapshot();
    });

    test('empty', () => {
      const lines = [];

      const result = parsePreSpreadLines(lines);

      expect(result).toMatchSnapshot();
    });
  });
});