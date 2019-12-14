import { preprocessLines } from './index';

describe('preprocessLines', () => {
  describe('single page', () => {
    it('first page', () => {
      const input = [`page`];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('adding page at start', () => {
      const input = [
        'page',
        'Page 1',
        'this is page 1 info'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('adding page at end', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'page'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('adding page in the middle', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'page',
        'Page 2',
        'this is page 2 info'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
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

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('inserting page at end', () => {
      const input = [
        'Page 2',
        'this is page 2 info',
        'Page 1',
        'this is page 1 info'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
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

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('remove page from start', () => {
      const input = [
        'Page 2',
        'this is page 2 info',
        'Page 3',
        'this is page 3 info'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('remove page from middle', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'Page 3',
        'this is page 3 info'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('inserting content with page count in double digits', () => {
      const tenPages = Array.from(new Array(10), (_, i) => `Page ${i + 1}`);
      const input = tenPages.concat(['page', 'page', 'page']);

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });
  });

  describe('panels', () => {
    it('adding panel to page', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'panel'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('adding second panel to page', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'Panel 1',
        'panel'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('adding panel at start', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'panel',
        'Panel 1',
        'this is panel 1 info'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
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

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('adding panel to second page', () => {
      const input = [
        'Page 1',
        'Panel 1',
        'this is panel 1 info',
        'Page 2',
        'panel'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('adding another panel to second page', () => {
      const input = [
        'Page 1',
        'Panel 1',
        'this is panel 1 info',
        'Page 2',
        'Panel 1',
        'panel'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('inserting panel at start', () => {
      const input = [
        'Page 1',
        'this is page 1 info',
        'Panel 2',
        'Panel 1',
        'this is panel 1 info'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
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

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('removing panel from start', () => {
      const input = [
        'Page 1',
        'Panel 2',
        'this is panel 2 info'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });

    it('removing panel from middle', () => {
      const input = [
        'Page 1',
        'Panel 1',
        'this is panel 1 info',
        'Panel 3',
        'this is panel 3 info'
      ];

      const result = preprocessLines(input);

      expect(result).toMatchSnapshot();
    });
  });
});
