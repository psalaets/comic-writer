import createAutoNumber from './auto-number';

describe('auto number', () => {
  it('single page', () => {
    const classifications = [
      { type: 'single-page' },
      { type: 'regular' },
      { type: 'single-page', },
      { type: 'regular' },
    ];
    const autoNumber = createAutoNumber(classifications);

    const result = [
      'page',
      'blah',
      'page',
      'foo'
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
    const classifications = [
      { type: 'multi-page', count: 2 },
      { type: 'regular' },
      { type: 'multi-page', count: 2 },
      { type: 'regular' },
    ];
    const autoNumber = createAutoNumber(classifications);

    const result = [
      'page 1-2',
      'blah',
      'page 3-4',
      'foo'
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
    const classifications = [
      { type: 'multi-page', count: 3 },
      { type: 'regular' },
      { type: 'multi-page', count: 4 },
      { type: 'regular' },
    ];
    const autoNumber = createAutoNumber(classifications);

    const result = [
      'page 1-3',
      'blah',
      'page 4-7',
      'foo',
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
    const classifications = [
      { type: 'single-page' },
      { type: 'regular' },
      { type: 'partial-page-range' },
      { type: 'multi-page', count: 2 },
      { type: 'regular' },
      { type: 'multi-page', count: 4 },
      { type: 'regular' },
    ];
    const autoNumber = createAutoNumber(classifications);

    const result = [
      'page 1',
      'blah',
      'page 2-',
      'page 3-4',
      'foo',
      'page 5-8',
      'bar'
    ]
      .map(autoNumber);

    expect(result).toEqual([
      'Page 1',
      'blah',
      'Pages 2-',
      'Pages 3-4',
      'foo',
      'Pages 5-8',
      'bar'
    ]);
  });

  it('partial page range', () => {
    const classifications = [
      { type: 'partial-page-range' },
      { type: 'regular' },
      { type: 'partial-page-range' },
      { type: 'regular' },
    ];
    const autoNumber = createAutoNumber(classifications);

    const result = [
      'page 1-',
      'blah',
      'page 2-',
      'foo'
    ]
      .map(autoNumber);

    expect(result).toEqual([
      'Pages 1-',
      'blah',
      'Pages 2-',
      'foo'
    ]);
  });

  it('multi page with count < 1 is output as-is', () => {
    const classifications = [
      { type: 'multi-page', count: 0 },
      { type: 'regular' },
      { type: 'multi-page', count: -1 },
      { type: 'regular' },
    ];
    const autoNumber = createAutoNumber(classifications);

    const result = [
      'Pages 2-2',
      'blah',
      'Pages 2-1',
      'foo'
    ]
      .map(autoNumber);

    expect(result).toEqual([
      'Pages 2-2',
      'blah',
      'Pages 2-1',
      'foo'
    ]);
  });

  it('single panel', () => {
    const classifications = [
      { type: 'panel' },
      { type: 'regular' },
      { type: 'panel' },
      { type: 'regular' },
    ];
    const autoNumber = createAutoNumber(classifications);

    const result = [
      'panel',
      'blah',
      'panel',
      'foo'
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
