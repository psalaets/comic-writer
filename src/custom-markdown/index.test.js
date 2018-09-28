import { parse } from './index';

describe('custom markdown', () => {
  describe('parse()', () => {
    it('single page', () => {
      const result = parse(`
## Page 1

`);

      expect(result).toMatchSnapshot();
    });

    it('two pages', () => {
      const result = parse(`
## Page 1

## Page 2

`);

      expect(result).toMatchSnapshot();
    });

    it('pages with panels', () => {
      const result = parse(`
## Page 1

## Page 2

### Panel 1

### Panel 2
`);

      expect(result).toMatchSnapshot();
    });

    it('pages with panels and lettering', () => {
      const result = parse(`
## Page 1

## Page 2

### Panel 1

> bob: ok

> bob: try it *again*

### Panel 2

This is panel description.

> sfx: boom

> caption: yep
`);

      expect(result).toMatchSnapshot();
    });
  });
});