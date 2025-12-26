/**
 * Tests for ratings method
 */

import { test, expect, describe } from 'bun:test';
import { ratings } from '../src/index.ts';

describe('Ratings method', () => {
  test('should fetch ratings for an app', async () => {
    const result = await ratings({ id: '553834731' });

    expect(typeof result.ratings).toBe('number');
    expect(result.ratings).toBeGreaterThanOrEqual(0);

    expect(typeof result.histogram).toBe('object');
    expect(typeof result.histogram[1]).toBe('number');
    expect(typeof result.histogram[2]).toBe('number');
    expect(typeof result.histogram[3]).toBe('number');
    expect(typeof result.histogram[4]).toBe('number');
    expect(typeof result.histogram[5]).toBe('number');
  }, 15000);

  test('should throw error when id is not provided', async () => {
    // @ts-expect-error Testing invalid input
    await expect(ratings({})).rejects.toThrow('id is required');
  });
});
