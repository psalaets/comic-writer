import { unbold } from './unbold';

const string = '**this is bold**'
const start = 5;
const boldToken = {
  string,
  start,
  end: start + string.length,
  style: 'lettering-content lettering-bold'
};

describe('unbold()', () => {
  test('unbolding in middle of token', () => {
    const parts = unbold(boldToken, start + 5, start + 11);

    expect(parts).toEqual([
      {
        string: '**thi**',
        bold: true
      },
      {
        string: 's is b',
        bold: false
      },
      {
        string: '**old**',
        bold: true
      }
    ]);
  });

  test('unbolding only left side', () => {
    const parts = unbold(boldToken, start - 2, start + 5);

    expect(parts).toEqual([
      {
        string: 'thi',
        bold: false
      }, {
        string: '**s is bold**',
        bold: true
      }
    ]);
  });

  test('unbolding only right side', () => {
    const parts = unbold(boldToken, string.length - 5, string.length + 5);

    expect(parts).toEqual([
      {
        string: '**this is b**',
        bold: true
      },
      {
        string: 'old',
        bold: false
      }
    ]);
  });

  test('unbolding everything', () => {
    const parts = unbold(boldToken, start, start + string.length);

    expect(parts).toEqual([
      {
        string: 'this is bold',
        bold: false
      }
    ]);
  });
});
