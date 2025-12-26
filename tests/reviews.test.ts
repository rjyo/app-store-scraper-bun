/**
 * Tests for reviews method
 */

import { test, expect, describe } from 'bun:test';
import { reviews, sort } from '../src/index.ts';

describe('Reviews method', () => {
  test('should fetch reviews for an app', async () => {
    const result = await reviews({ id: '553834731' });

    expect(Array.isArray(result)).toBe(true);

    if (result.length > 0) {
      const review = result[0]!;
      expect(typeof review.id).toBe('string');
      expect(typeof review.userName).toBe('string');
      expect(typeof review.userUrl).toBe('string');
      expect(typeof review.version).toBe('string');
      expect(typeof review.score).toBe('number');
      expect(review.score).toBeGreaterThanOrEqual(1);
      expect(review.score).toBeLessThanOrEqual(5);
      expect(typeof review.title).toBe('string');
      expect(typeof review.text).toBe('string');
      expect(typeof review.url).toBe('string');
      expect(typeof review.updated).toBe('string');
    }
  }, 15000);

  test('should fetch reviews sorted by helpful', async () => {
    const result = await reviews({ id: '553834731', sort: sort.HELPFUL });

    expect(Array.isArray(result)).toBe(true);
  }, 15000);

  test('should fetch reviews for a specific page', async () => {
    const result = await reviews({ id: '553834731', page: 2 });

    expect(Array.isArray(result)).toBe(true);
  }, 15000);

  test('should throw error for invalid sort option', async () => {
    await expect(
      reviews({
        id: '553834731',
        sort: 'invalid' as 'mostRecent',
      })
    ).rejects.toThrow('Invalid sort invalid');
  });

  test('should throw error for page less than 1', async () => {
    await expect(reviews({ id: '553834731', page: 0 })).rejects.toThrow(
      'Page cannot be lower than 1'
    );
  });

  test('should throw error for page greater than 10', async () => {
    await expect(reviews({ id: '553834731', page: 11 })).rejects.toThrow(
      'Page cannot be greater than 10'
    );
  });

  test('should throw error when neither id nor appId provided', async () => {
    await expect(reviews({} as { id?: string })).rejects.toThrow('Either id or appId is required');
  });
});
