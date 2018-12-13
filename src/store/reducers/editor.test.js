import { transformMarkdown } from './editor';

describe('editor reducer', () => {
  describe('transformMarkdown', () => {
    describe('pages', () => {
      it('first page', () => {
        const input = `page`;

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('adding page at start', () => {
        const input = 'page\nPage 1\nthis is page 1 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('adding page at end', () => {
        const input = 'Page 1\nthis is page 1 info\npage';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('adding page in the middle', () => {
        const input = 'Page 1\nthis is page 1 info\npage\nPage 2\nthis is page 2 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('inserting page at start', () => {
        const input = 'Page 3\nthis is page 3 info\nPage 1\nthis is page 1 info\nPage 2\nthis is page 2 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('inserting page at end', () => {
        const input = 'Page 2\nthis is page 2 info\nPage 1\nthis is page 1 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('inserting page in middle', () => {
        const input = 'Page 1\nthis is page 1 info\nPage 3\nthis is page 3 info\nPage 2\nthis is page 2 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('remove page from start', () => {
        const input = 'Page 2\nthis is page 2 info\nPage 3\nthis is page 3 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('remove page from middle', () => {
        const input = 'Page 1\nthis is page 1 info\nPage 3\nthis is page 3 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('inserting content with page count in double digits', () => {
        const tenPages = Array.from(new Array(10), (p, i) => `Page ${i + 1}`).join('\n');
        const input = tenPages + '\npage\npage\npage';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });
    });

    describe('panels', () => {
      it('adding panel to page', () => {
        const input = 'Page 1\nthis is page 1 info\npanel';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('adding second panel to page', () => {
        const input = 'Page 1\nthis is page 1 info\nPanel 1\npanel';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('adding panel at start', () => {
        const input = 'Page 1\nthis is page 1 info\npanel\nPanel 1\nthis is panel 1 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('adding panel in middle', () => {
        const input = 'Page 1\nPanel 1\nthis is panel 1 info\npanel\nPanel 2\nthis is panel 2 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('adding panel to second page', () => {
        const input = 'Page 1\nPanel 1\nthis is panel 1 info\nPage 2\npanel';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('adding another panel to second page', () => {
        const input = 'Page 1\nPanel 1\nthis is panel 1 info\nPage 2\nPanel 1\npanel';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('inserting panel at start', () => {
        const input = 'Page 1\nthis is page 1 info\nPanel 2\nPanel 1\nthis is panel 1 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('inserting panel in middle', () => {
        const input = 'Page 1\nPanel 1\nthis is panel 1 info\nPanel 3\nPanel 2\nthis is panel 2 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('removing panel from start', () => {
        const input = 'Page 1\nPanel 2\nthis is panel 2 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });

      it('removing panel from middle', () => {
        const input = 'Page 1\nPanel 1\nthis is panel 1 info\nPanel 3\nthis is panel 3 info';

        const result = transformMarkdown(input);

        expect(result).toMatchSnapshot();
      });
    });
  });
});