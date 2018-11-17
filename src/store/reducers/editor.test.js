import { transformMarkdown } from './editor';

describe('editor reducer', () => {
  describe('transformMarkdown', () => {
    describe('pages', () => {
      it('first page', () => {
        const input = `page `;

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('adding page at start', () => {
        const input = 'page \nPage 1\npage 1 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('adding page at end', () => {
        const input = 'Page 1\npage 1 info\npage ';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('adding page in the middle', () => {
        const input = 'Page 1\npage 1 info\npage \nPage 2\npage 2 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('inserting page at start', () => {
        const input = 'Page 3\npage 3 info\nPage 1\npage 1 info\nPage 2\npage 2 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('inserting page at end', () => {
        const input = 'Page 2\npage 2 info\nPage 1\npage 1 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('inserting page in middle', () => {
        const input = 'Page 1\npage 1 info\nPage 3\npage 3 info\nPage 2\npage 2 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('remove page from start', () => {
        const input = 'Page 2\npage 2 info\nPage 3\npage 3 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('remove page from middle', () => {
        const input = 'Page 1\npage 1 info\nPage 3\npage 3 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('inserting content with page count in double digits', () => {
        const tenPages = Array.from(new Array(10), (p, i) => `Page ${i + 1}`).join('\n');
        const input = tenPages + '\npage \npage \npage ';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });
    });

    describe('panels', () => {
      it('adding panel to page', () => {
        const input = 'Page 1\npage 1 info\npanel ';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('adding second panel to page', () => {
        const input = 'Page 1\npage 1 info\nPanel 1\npanel ';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('adding panel at start', () => {
        const input = 'Page 1\npage 1 info\npanel \nPanel 1\npanel 1 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('adding panel in middle', () => {
        const input = 'Page 1\nPanel 1\npanel 1 info\npanel \nPanel 2\npanel 2 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('adding panel to second page', () => {
        const input = 'Page 1\nPanel 1\npanel 1 info\nPage 2\npanel ';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('adding another panel to second page', () => {
        const input = 'Page 1\nPanel 1\npanel 1 info\nPage 2\nPanel 1\npanel ';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('inserting panel at start', () => {
        const input = 'Page 1\npage 1 info\nPanel 2\nPanel 1\npanel 1 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('inserting panel in middle', () => {
        const input = 'Page 1\nPanel 1\npanel 1 info\nPanel 3\nPanel 2\npanel 2 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('removing panel from start', () => {
        const input = 'Page 1\nPanel 2\npanel 2 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });

      it('removing panel from middle', () => {
        const input = 'Page 1\nPanel 1\npanel 1 info\nPanel 3\npanel 3 info';

        const result = transformMarkdown(input, 0);

        expect(result.value).toMatchSnapshot();
      });
    });

    describe('detecting cursorAtEnd', () => {
      it('cursor at the end of input', () => {
        const input = 'abc';

        const result = transformMarkdown(input, 3);

        expect(result.cursorAtEnd).toBe(true);
      });

      it('cursor in middle of value', () => {
        const input = 'abc';

        const result = transformMarkdown(input, 1);

        expect(result.cursorAtEnd).toBe(false);
      });
    });

    describe('cursorPage and cursorPanel', () => {
      it('cursor in a page and panel', () => {
        const input = 'Page 1\nPage 2\nPanel 1\nadsf';

        const result = transformMarkdown(input, input.length - 3);

        expect(result.cursorPage).toBe(2);
        expect(result.cursorPanel).toBe(1);
      });

      it('cursor has no page nor panel', () => {
        const input = 'asdf';

        const result = transformMarkdown(input, input.length - 3);

        expect(result.cursorPage).toBe(undefined);
        expect(result.cursorPanel).toBe(undefined);
      });

      it('cursor has page only', () => {
        const input = 'Page 1\nPage 2\nasdf';

        const result = transformMarkdown(input, input.length - 3);

        expect(result.cursorPage).toBe(2);
        expect(result.cursorPanel).toBe(undefined);
      });

      it('cursor has panel only', () => {
        const input = 'Panel 1\nPanel 2\nasdf';

        const result = transformMarkdown(input, input.length - 3);

        expect(result.cursorPage).toBe(undefined);
        expect(result.cursorPanel).toBe(2);
      });
    });
  });
});