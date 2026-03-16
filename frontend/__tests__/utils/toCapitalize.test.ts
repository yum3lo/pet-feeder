import { toCapitalize } from '@/utils';

describe('toCapitalize', () => {
  it('capitalizes the first letter of a lowercase string', () => {
    expect(toCapitalize('hello')).toBe('Hello');
  });

  it('returns an empty string unchanged', () => {
    expect(toCapitalize('')).toBe('');
  });

  it('leaves an already-capitalized string unchanged', () => {
    expect(toCapitalize('World')).toBe('World');
  });

  it('capitalizes a single character', () => {
    expect(toCapitalize('a')).toBe('A');
  });

  it('only changes the first character, leaving the rest as-is', () => {
    expect(toCapitalize('hELLO')).toBe('HELLO');
  });

  it('handles a string that starts with a number', () => {
    expect(toCapitalize('123abc')).toBe('123abc');
  });
});
