import parse from './index';

describe('parse()', () => {
  it('single page', () => {
    const result = parse(`Page 1`);

    expect(result).toMatchSnapshot();
  });

  it('two pages', () => {
    const result = parse(`Page 1

Page 2`);

    expect(result).toMatchSnapshot();
  });

  it('no blank lines', () => {
    const result = parse(`Page 1
Page 2`);

    expect(result).toMatchSnapshot();
  });

  it('many blank lines', () => {
    const result = parse(`Page 1





Page 2`);

    expect(result).toMatchSnapshot();
  });

  it('pages with panels', () => {
    const result = parse(`Page 1

Page 2

Panel 1

Panel 2`);

    expect(result).toMatchSnapshot();
  });

  it('pages with panels and lettering', () => {
    const result = parse(`Page 1

Page 2

Panel 1

> bob: ok

> bob: try it again

Panel 2

This is panel description.

> sfx: boom

> caption: yep`);

    expect(result).toMatchSnapshot();
  });

  it('dialogue with bold', () => {
    const result = parse(`Page 1
Panel 1

> bob: eat **this** not **that**!

> bob: this is *not*`);

    expect(result).toMatchSnapshot();
  });

  it('dialogue starts with bold', () => {
    const result = parse(`Page 1
Panel 1

> bob: **only bold**

> bob: **starts bold** and then
`);

    expect(result).toMatchSnapshot();
  });

  it('caption with bold', () => {
    const result = parse(`Page 1
Panel 1

> caption: **I** didn't mean **that**!

> caption: this is *not*`);

    expect(result).toMatchSnapshot();
  });

  it('kitchen sink', () => {
    const result = parse(`title: test
issue: 1
by: the author

Page 1

Panel 1

Some characters stand around. And do stuff.

> bob: ok

> bob: try it **again**

Panel 2

This is panel description.

> sfx: boom

> caption: yep`);

    expect(result).toMatchSnapshot();
  });
});