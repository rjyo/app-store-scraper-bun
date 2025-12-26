/**
 * Tests for suggest method
 */

import { test, expect, describe } from 'bun:test';
import { suggest } from '../src/index.ts';

describe('Suggest method', () => {
  test('should fetch suggestions for a term', async () => {
    const result = await suggest({ term: 'clash' });

    expect(Array.isArray(result)).toBe(true);

    if (result.length > 0) {
      const suggestion = result[0]!;
      expect(typeof suggestion.term).toBe('string');
      expect(suggestion.term.length).toBeGreaterThan(0);
    }
  }, 15000);

  test('should throw error when term is not provided', async () => {
    // @ts-expect-error Testing invalid input
    await expect(suggest({})).rejects.toThrow('term is required');
  });
});
