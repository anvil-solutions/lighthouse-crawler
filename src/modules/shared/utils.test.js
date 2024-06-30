import { describe, expect, it } from 'vitest';
import { padNumber } from './utils.js';

describe('number padding', () => {
  it('should pad a negative number', () => {
    expect(padNumber(-1)).toBe(' -1');
  });

  it('should pad a positive number', () => {
    expect(padNumber(1)).toBe('  1');
  });

  it('should pad a big number', () => {
    expect(padNumber(9999)).toBe('9999');
  });
});
