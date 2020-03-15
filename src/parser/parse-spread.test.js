import { parseSpread } from './parse';

describe('parseSpread()', () => {
  it('single page', () => {
    const result = parseSpread(lines(`Page 1`));

    expect(result).toMatchSnapshot();
  });

  it('2 page range', () => {
    const result = parseSpread(lines(`Pages 1-2`));

    expect(result).toMatchSnapshot();
  });

  it('3 page range', () => {
    const result = parseSpread(lines(`Pages 1-3`));

    expect(result).toMatchSnapshot();
  });

  it('inverted page range', () => {
    const result = parseSpread(lines(`Pages 2-1`));

    expect(result).toMatchSnapshot();
  });

  it('self to self page range', () => {
    const result = parseSpread(lines(`Pages 2-2`));

    expect(result).toMatchSnapshot();
  });

  it('page with panels', () => {
    const result = parseSpread(lines(`Page 1

Panel 1

Panel 2`));

    expect(result).toMatchSnapshot();
  });

  it('page with panels and lettering', () => {
    const result = parseSpread(lines(`Page 1

Panel 1

\tbob: ok

\tbob: try it again

Panel 2

This is panel description.

\tsfx: boom

\tcaption: yep`));

    expect(result).toMatchSnapshot();
  });

  it('dialogue with modifier', () => {
    const result = parseSpread(lines(`Page 1
Panel 1

\tbob (yell): go!`));

    expect(result).toMatchSnapshot();
  });

  it('dialogue with bold', () => {
    const result = parseSpread(lines(`Page 1
Panel 1

\tbob: eat **this** not **that**!

\tbob: this is *not*`));

    expect(result).toMatchSnapshot();
  });

  it('dialogue starts with bold', () => {
    const result = parseSpread(lines(`Page 1
Panel 1

\tbob: **only bold**

\tbob: **starts bold** and then
`));

    expect(result).toMatchSnapshot();
  });

  it('caption with bold', () => {
    const result = parseSpread(lines(`Page 1
Panel 1

\tcaption: **I** didn't mean **that**!

\tcaption: this is *not*`));

    expect(result).toMatchSnapshot();
  });

  it('kitchen sink', () => {
    const result = parseSpread(lines(`Pages 1-2

Panel 1

Some characters stand around. And do stuff.

\tbob: ok

\tbob: try it **again**

Panel 2

This is panel description.

\tsfx: boom

\tcaption: yep

Panel 3

And they walk off into the sunset.
`));

    expect(result).toMatchSnapshot();
  });

  it('first line is not a page', () => {
    expect(() => {
      parseSpread(lines('Panel 1'));
    }).toThrowError();
  });
});

function lines(source) {
  return source.split('\n');
}
