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

  it('2 page range', () => {
    const result = parse(`Pages 1-2`);

    expect(result).toMatchSnapshot();
  });

  it('3 page range', () => {
    const result = parse(`Pages 1-3`);

    expect(result).toMatchSnapshot();
  });

  it('inverted page range', () => {
    const result = parse(`Pages 2-1`);

    expect(result).toMatchSnapshot();
  });

  it('self to self page range', () => {
    const result = parse(`Pages 2-2`);

    expect(result).toMatchSnapshot();
  });

  it('page mix', () => {
    const result = parse(`Page 1

Pages 2-3

Page 4

Pages 5-10`);

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

\tbob: ok

\tbob: try it again

Panel 2

This is panel description.

\tsfx: boom

\tcaption: yep`);

    expect(result).toMatchSnapshot();
  });

  it('dialogue with modifier', () => {
    const result = parse(`Page 1
Panel 1

\tbob (yell): go!`);

    expect(result).toMatchSnapshot();
  });

  it('dialogue with bold', () => {
    const result = parse(`Page 1
Panel 1

\tbob: eat **this** not **that**!

\tbob: this is *not*`);

    expect(result).toMatchSnapshot();
  });

  it('dialogue starts with bold', () => {
    const result = parse(`Page 1
Panel 1

\tbob: **only bold**

\tbob: **starts bold** and then
`);

    expect(result).toMatchSnapshot();
  });

  it('caption with bold', () => {
    const result = parse(`Page 1
Panel 1

\tcaption: **I** didn't mean **that**!

\tcaption: this is *not*`);

    expect(result).toMatchSnapshot();
  });

  it('kitchen sink', () => {
    const result = parse(`title: test
issue: 1
by: the author

Pages 1-2

Panel 1

Some characters stand around. And do stuff.

\tbob: ok

\tbob: try it **again**

Panel 2

This is panel description.

\tsfx: boom

\tcaption: yep

Page 3

Panel 1

And they walk off into the sunset.
`);

    expect(result).toMatchSnapshot();
  });
});