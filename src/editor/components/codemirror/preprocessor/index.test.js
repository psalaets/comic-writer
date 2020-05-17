import { createPreprocessor } from './index';

describe('preprocessLines', () => {
  describe('single page', () => {
    it('first page', () => {
      const input = [`page`];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 1, 0, 0);

      expect(result).toEqual([
        "Page 1",
      ]);
    });

    it('page with cursor on the line is not changed', () => {
      const input = ['Page 1', 'page '];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 1, 1, 1);

      expect(result).toEqual([
        'Page 1',
        "page ",
      ]);
    });

    it('adding page at start', () => {
      const input = [
        'page',
        'Page 1',
        'this is page 1 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 1, 0, 0);

      expect(result).toEqual([
        "Page 1",
        "Page 2",
        "this is page 1 info",
      ]);
    });

    it('adding page at end', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'page'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 3, 2, 2);

      expect(result).toEqual([
        "Page 1",
        "this is page 1 info",
        "Page 2",
      ]);
    });

    it('adding page in the middle', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'page',
        'Page 2',
        'this is page 2 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 3, 2, 2);

      expect(result).toEqual([
        "Page 1",
        "this is page 1 info",
        "Page 2",
        "Page 3",
        "this is page 2 info",
      ]);
    });

    it('inserting page at start', () => {
      const input = [
        'Page 3',
        'this is page 3 info',
        'Page 1',
        'this is page 1 info',
        'Page 2',
        'this is page 2 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 0, 0, 0);

      expect(result).toEqual([
        "Page 1",
        "this is page 3 info",
        "Page 2",
        "this is page 1 info",
        "Page 3",
        "this is page 2 info",
      ]);
    });

    it('inserting page at end', () => {
      const input = [
        'Page 2',
        'this is page 2 info',
        'Page 1',
        'this is page 1 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 2, 2, 3);

      expect(result).toEqual([
        "Page 1",
        "this is page 2 info",
        "Page 2",
        "this is page 1 info",
      ]);
    });

    it('inserting page in middle', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'Page 3',
        'this is page 3 info',
        'Page 2',
        'this is page 2 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 2, 2, 3);

      expect(result).toEqual([
        "Page 1",
        "this is page 1 info",
        "Page 2",
        "this is page 3 info",
        "Page 3",
        "this is page 2 info",
      ]);
    });

    it('remove page from start', () => {
      const input = [
        'Page 2',
        'this is page 2 info',
        'Page 3',
        'this is page 3 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 0, 0, 0);

      expect(result).toEqual([
        "Page 1",
        "this is page 2 info",
        "Page 2",
        "this is page 3 info",
      ]);
    });

    it('remove page from middle', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'Page 3',
        'this is page 3 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 2, 2, 3);

      expect(result).toEqual([
        "Page 1",
        "this is page 1 info",
        "Page 2",
        "this is page 3 info",
      ]);
    });

    it('inserting content with page count in double digits', () => {
      const tenPages = Array.from(new Array(10), (_, i) => `Page ${i + 1}`);
      const input = tenPages.concat(['page']);

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 1, 10, 10);

      expect(result).toEqual([
        "Page 1",
        "Page 2",
        "Page 3",
        "Page 4",
        "Page 5",
        "Page 6",
        "Page 7",
        "Page 8",
        "Page 9",
        "Page 10",
        "Page 11",
      ]);
    });
  });

  describe('panels', () => {
    it('adding panel to page', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'panel',
        ''
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 3, 2, 2);

      expect(result).toEqual([
        "Page 1",
        "this is page 1 info",
        "Panel 1",
        ''
      ]);
    });

    it('adding second panel to page', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'Panel 1',
        'panel',
        ''
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 4, 3, 3);

      expect(result).toEqual([
        "Page 1",
        "this is page 1 info",
        "Panel 1",
        "Panel 2",
        ''
      ]);
    });

    it('adding panel at start', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'panel',
        'Panel 1',
        'this is panel 1 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 3, 2, 2);

      expect(result).toEqual([
        "Page 1",
        "this is page 1 info",
        "Panel 1",
        "Panel 2",
        "this is panel 1 info",
      ]);
    });

    it('adding panel in middle', () => {
      const input = [
        'Page 1',
        'Panel 1',
        'this is panel 1 info',
        'panel',
        'Panel 2',
        'this is panel 2 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 4, 3, 3);

      expect(result).toEqual([
        "Page 1",
        "Panel 1",
        "this is panel 1 info",
        "Panel 2",
        "Panel 3",
        "this is panel 2 info",
      ]);
    });

    it('adding panel to second page', () => {
      const input = [
        'Page 1',
        'Panel 1',
        'this is panel 1 info',
        'Page 2',
        'panel',
        ''
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 5, 4, 4);

      expect(result).toEqual([
        "Page 1",
        "Panel 1",
        "this is panel 1 info",
        "Page 2",
        "Panel 1",
        ''
      ]);
    });

    it('adding another panel to second page', () => {
      const input = [
        'Page 1',
        'Panel 1',
        'this is panel 1 info',
        'Page 2',
        'Panel 1',
        'panel',
        ''
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 6, 5, 5);

      expect(result).toEqual([
        "Page 1",
        "Panel 1",
        "this is panel 1 info",
        "Page 2",
        "Panel 1",
        "Panel 2",
        ''
      ]);
    });

    it('inserting panel at start', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'Panel 2',
        'Panel 1',
        'this is panel 1 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 2, 2, 2);

      expect(result).toEqual([
        "Page 1",
        "this is page 1 info",
        "Panel 1",
        "Panel 2",
        "this is panel 1 info",
      ]);
    });

    it('inserting panel in middle', () => {
      const input = [
        'Page 1',
        'Panel 1',
        'this is panel 1 info',
        'Panel 3',
        'Panel 2',
        'this is panel 2 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 3, 3, 3);

      expect(result).toEqual([
        "Page 1",
        "Panel 1",
        "this is panel 1 info",
        "Panel 2",
        "Panel 3",
        "this is panel 2 info",
      ]);
    });

    it('removing panel from start', () => {
      const input = [
        'Page 1',
        'Panel 2',
        'this is panel 2 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 1, 1, 1);

      expect(result).toEqual([
        "Page 1",
        "Panel 1",
        "this is panel 2 info",
      ]);
    });

    it('removing panel from middle', () => {
      const input = [
        'Page 1',
        'Panel 1',
        'this is panel 1 info',
        'Panel 3',
        'this is panel 3 info'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 3, 3, 3);

      expect(result).toEqual([
        "Page 1",
        "Panel 1",
        "this is panel 1 info",
        "Panel 2",
        "this is panel 3 info",
      ]);
    });
  });

  describe('all caps in lettering metadata', () => {
    it('with subject but no modifier', () => {
      const input = [
        'Page 1',
        'Panel 1',
        '\tblah: the content'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 2, 2, 2);

      expect(result).toEqual([
        "Page 1",
        "Panel 1",
        '\tBLAH: the content',
      ]);
    });

    it('with both subject and modifier', () => {
      const input = [
        'Page 1',
        'Panel 1',
        '\tblah (off): the content'
      ];

      const preprocessLines = createPreprocessor();
      const result = preprocessLines(input, 2, 2, 2);

      expect(result).toEqual([
        "Page 1",
        "Panel 1",
        '\tBLAH (OFF): the content',
      ]);
    });
  });

  describe('fromLine is not the first line', () => {
    // This scenario should not happen in real usage, fromLine should never be
    // after lines that actually changed. This test is just to check that
    // fromLine is used.
    it('doesnt process lines before the fromLine', () => {
      const firstLines = [
        'Page 1',
        'Page 2',
        'this is page 2 info'
      ];

      const preprocessLines = createPreprocessor();
      const firstResult = preprocessLines(firstLines, 3, 0, 0);

      expect(firstResult).toEqual([
        'Page 1',
        'Page 2',
        'this is page 2 info'
      ]);

      const secondLines = [
        'blah', // this will have no effect
        'Page 2',
        'this is page 2 info'
      ];

      const secondResult = preprocessLines(secondLines, 3, 1, 1);

      expect(secondResult).toEqual([
        'Page 1', // this line wasn't changed between 1st and 2nd call because it's before fromLine
        'Page 2',
        'this is page 2 info'
      ]);
    })
  });
});
