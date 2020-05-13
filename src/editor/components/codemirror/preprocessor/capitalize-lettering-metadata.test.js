import { capitalizeLetteringMetadata } from './capitalize-lettering-metadata';

describe('capitalizeLetteringMetadata', () => {
  test('capitalizes subject', () => {
    const result = capitalizeLetteringMetadata('\tblah: let\'s do it');

    expect(result).toBe('\tBLAH: let\'s do it');
  });

  test('capitalizes modifier', () => {
    const result = capitalizeLetteringMetadata('\tblah (off): let\'s do it');

    expect(result).toBe('\tBLAH (OFF): let\'s do it');
  });

  test('does not capitalize lettering line with no colon', () => {
    const result = capitalizeLetteringMetadata('\tblah (off)');

    expect(result).toBe('\tblah (off)');
  });

  test('does not capitalize non-lettering line', () => {
    const result = capitalizeLetteringMetadata('just a regular line');

    expect(result).toBe('just a regular line');
  });
});
