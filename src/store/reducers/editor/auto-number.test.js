import createAutoNumber from './auto-number';

describe('auto number', () => {
  it('single page', () => {
    const autoNumber = createAutoNumber();

    const result = [
      { type: 'page', count: 1},
      { type: 'regular', line: 'blah' },
      { type: 'page', count: 1 },
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
      { type: 'page', count: 2 },
      { type: 'regular', line: 'blah' },
      { type: 'page', count: 2 },
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

  it('big page range', () => {
    const autoNumber = createAutoNumber();

    const result = [
      { type: 'page', count: 3 },
      { type: 'regular', line: 'blah' },
      { type: 'page', count: 4 },
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

  it('page mixture', () => {
    const autoNumber = createAutoNumber();

    const result = [
      { type: 'page', count: 1 },
      { type: 'regular', line: 'blah' },
      { type: 'page', count: 2 },
      { type: 'regular', line: 'foo' },
      { type: 'page', count: 4 },
      { type: 'regular', line: 'bar' },
    ]
      .map(autoNumber);

    expect(result).toEqual([
      'Page 1',
      'blah',
      'Pages 2-3',
      'foo',
      'Pages 4-7',
      'bar'
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
