import { wrapSelection } from './index';

describe('wrapSelection', () => {
  it('everything selected', () => {
    const result = wrapSelection('house', 0, 5, '[', ']');

    expect(result).toBe('[house]');
  });

  it('front selected', () => {
    const result = wrapSelection('house', 0, 2, '[', ']');

    expect(result).toBe('[ho]use');
  });

  it('middle selected', () => {
    const result = wrapSelection('house', 1, 4, '[', ']');

    expect(result).toBe('h[ous]e');
  });

  it('end selected', () => {
    const result = wrapSelection('house', 3, 5, '[', ']');

    expect(result).toBe('hou[se]');
  });

  it('blank line', () => {
    const result = wrapSelection('', 0, 0, '[', ']');

    expect(result).toBe('[]');
  });

  it('nothing selected', () => {
    const result = wrapSelection('house', 2, 2, '[', ']');

    expect(result).toBe('ho[]use');
  });
});
