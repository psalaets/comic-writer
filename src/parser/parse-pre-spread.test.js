import { parsePreSpread } from './parse';

describe('parsePreSpread()', () => {
  it('only metadata', () => {
    const result = parsePreSpread(lines(`title: test

issue: 1

by: the author
`));

    expect(result).toMatchSnapshot();
  });

  it('only paragraphs', () => {
    const result = parsePreSpread(lines(`This is the first paragraph.
This is second paragraph

Third paragraph

Final paragraph
`));

    expect(result).toMatchSnapshot();
  });

  it('metadata and paragraphs', () => {
    const result = parsePreSpread(lines(`title: My comic
issue: 1
by: me
for: my art team

This is first paragraph
This is second paragraph

Third paragraph

Final paragraph
`));

    expect(result).toMatchSnapshot();
  });

  it('starts with blanks', () => {
    const result = parsePreSpread(lines(`


title: My comic
issue: 1
by: me
for: my art team

This is first paragraph
This is second paragraph

Third paragraph

Final paragraph
`));

    expect(result).toMatchSnapshot();
  });

  it('empty', () => {
    const result = parsePreSpread([]);

    expect(result).toMatchSnapshot();
  });
});

function lines(source) {
  return source.split('\n');
}
