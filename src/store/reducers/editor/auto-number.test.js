import createAutoNumber from './auto-number';

describe('auto number', () => {
  it('single page', () => {
    const autoNumber = createAutoNumber();

    const result = [
      { type: 'single-page'},
      { type: 'regular', line: 'blah' },
      { type: 'single-page', },
      { type: 'regular', line: 'foo' },
    ]
      .map(autoNumber);

    expect(result).toEqual([
      'Page 1',
      'blah',
      'Page 2',
      'foo'
    ]);
  });

  it('2 page spread', () => {
    const autoNumber = createAutoNumber();

    const result = [
      { type: 'multi-page', count: 2 },
      { type: 'regular', line: 'blah' },
      { type: 'multi-page', count: 2 },
      { type: 'regular', line: 'foo' },
    ]
      .map(autoNumber);

    expect(result).toEqual([
      'Pages 1-2',
      'blah',
      'Pages 3-4',
      'foo'
    ]);
  });

  it('big multi page', () => {
    const autoNumber = createAutoNumber();

    const result = [
      { type: 'multi-page', count: 3 },
      { type: 'regular', line: 'blah' },
      { type: 'multi-page', count: 4 },
      { type: 'regular', line: 'foo' },
    ]
      .map(autoNumber);

    expect(result).toEqual([
      'Pages 1-3',
      'blah',
      'Pages 4-7',
      'foo'
    ]);
  });

  it('all page types together', () => {
    const autoNumber = createAutoNumber();

    const result = [
      { type: 'single-page' },
      { type: 'regular', line: 'blah' },
      { type: 'partial-page-range' },
      { type: 'multi-page', count: 2 },
      { type: 'regular', line: 'foo' },
      { type: 'multi-page', count: 4 },
      { type: 'regular', line: 'bar' },
    ]
      .map(autoNumber);

    expect(result).toEqual([
      'Page 1',
      'blah',
      'Page 2-',
      'Pages 3-4',
      'foo',
      'Pages 5-8',
      'bar'
    ]);
  });

  it('partial page range', () => {
    const autoNumber = createAutoNumber();

    const result = [
      { type: 'partial-page-range' },
      { type: 'regular', line: 'blah' },
      { type: 'partial-page-range' },
      { type: 'regular', line: 'foo' },
    ]
      .map(autoNumber);

    expect(result).toEqual([
      'Page 1-',
      'blah',
      'Page 2-',
      'foo'
    ]);
  });

  it('multi page with count < 1 is output as-is', () => {
    const autoNumber = createAutoNumber();

    const result = [
      { type: 'multi-page', count: 0, line: 'Page 2-1' },
      { type: 'regular', line: 'blah' },
      { type: 'multi-page', count: -1, line: 'Page 2-1' },
      { type: 'regular', line: 'foo' },
    ]
      .map(autoNumber);

    expect(result).toEqual([
      'Page 2-1',
      'blah',
      'Page 2-1',
      'foo'
    ]);
  });

  it('single panel', () => {
    const autoNumber = createAutoNumber();

    const result = [
      { type: 'panel' },
      { type: 'regular', line: 'blah' },
      { type: 'panel' },
      { type: 'regular', line: 'foo' },
    ]
      .map(autoNumber);

    expect(result).toEqual([
      'Panel 1',
      'blah',
      'Panel 2',
      'foo'
    ]);
  });
});
