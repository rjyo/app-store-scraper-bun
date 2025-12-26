/**
 * Tests for app method
 */

import { test, expect, describe } from 'bun:test';
import { app, memoized } from '../src/index.ts';
import { assertValidUrl } from './common.ts';

describe('App method', () => {
  test('should fetch valid application data', async () => {
    const result = await app({ id: '553834731' });

    expect(result.appId).toBe('com.midasplayer.apps.candycrushsaga');
    expect(result.title).toBe('Candy Crush Saga');
    expect(result.url).toContain('apps.apple.com');
    expect(result.url).toContain('553834731');
    assertValidUrl(result.icon);

    expect(typeof result.score).toBe('number');
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(5);

    // ratings should not be present without ratings option
    expect('ratings' in result && typeof result.ratings === 'number').toBe(false);
    expect('histogram' in result).toBe(false);

    expect(typeof result.reviews).toBe('number');
    expect(typeof result.description).toBe('string');
    expect(typeof result.updated).toBe('string');
    expect(result.primaryGenre).toBe('Games');
    expect(result.primaryGenreId).toBe(6014);

    expect(Array.isArray(result.genres)).toBe(true);
    expect(result.genres.length).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(result.genreIds)).toBe(true);
    expect(result.genreIds.length).toBeGreaterThanOrEqual(1);

    expect(typeof result.version).toBe('string');
    expect(typeof result.contentRating).toBe('string');
    expect(typeof result.requiredOsVersion).toBe('string');

    expect(result.price).toBe(0);
    expect(result.free).toBe(true);

    expect(result.developer).toBe('King');
    if (result.developerWebsite) {
      assertValidUrl(result.developerWebsite);
    }

    expect(result.screenshots.length).toBeGreaterThan(0);
    result.screenshots.forEach(assertValidUrl);

    expect(typeof result.releaseNotes).toBe('string');
  }, 15000);

  describe('with ratings option enabled', () => {
    test('should fetch valid application data with ratings', async () => {
      const result = await app({ id: '553834731', ratings: true });

      expect('ratings' in result).toBe(true);
      expect(typeof (result as { ratings: number }).ratings).toBe('number');

      expect('histogram' in result).toBe(true);
      const histogram = (result as unknown as { histogram: { [key: string]: number } }).histogram;
      expect(typeof histogram['1']).toBe('number');
      expect(typeof histogram['2']).toBe('number');
      expect(typeof histogram['3']).toBe('number');
      expect(typeof histogram['4']).toBe('number');
      expect(typeof histogram['5']).toBe('number');
    }, 15000);

    test('should fetch app with bundle id and ratings', async () => {
      const result = await app({
        appId: 'com.midasplayer.apps.candycrushsaga',
        ratings: true,
      });

      expect('ratings' in result).toBe(true);
      expect(typeof (result as { ratings: number }).ratings).toBe('number');

      expect('histogram' in result).toBe(true);
      const histogram = (result as unknown as { histogram: { [key: string]: number } }).histogram;
      expect(typeof histogram['1']).toBe('number');
      expect(typeof histogram['2']).toBe('number');
      expect(typeof histogram['3']).toBe('number');
      expect(typeof histogram['4']).toBe('number');
      expect(typeof histogram['5']).toBe('number');
    }, 15000);
  });

  test('should fetch app with bundle id', async () => {
    const result = await app({ appId: 'com.midasplayer.apps.candycrushsaga' });

    expect(result.id).toBe(553834731);
    expect(result.title).toBe('Candy Crush Saga');
    expect(result.url).toContain('apps.apple.com');
    expect('ratings' in result && typeof result.ratings === 'number').toBe(false);
    expect('histogram' in result).toBe(false);
  }, 15000);

  test('should fetch app in spanish locale', async () => {
    const result = await app({ id: '553834731', country: 'ar' });

    expect(result.appId).toBe('com.midasplayer.apps.candycrushsaga');
    expect(result.title).toBe('Candy Crush Saga');
    expect(result.url).toContain('apps.apple.com/ar');
  }, 15000);

  test('should fetch app in french locale', async () => {
    const result = await app({ id: '553834731', country: 'fr' });

    expect(result.appId).toBe('com.midasplayer.apps.candycrushsaga');
    expect(result.title).toBe('Candy Crush Saga');
    expect(result.url).toContain('apps.apple.com/fr');
  }, 15000);

  test('should reject the promise for an invalid id', async () => {
    await expect(app({ id: '123' })).rejects.toThrow('App not found (404)');
  }, 15000);

  test('should reject the promise for an invalid appId', async () => {
    await expect(app({ appId: '123' })).rejects.toThrow('App not found (404)');
  }, 15000);

  test('should memoize the results when memoize enabled', async () => {
    const memoizedStore = memoized();
    const result = await memoizedStore.app({ id: '553834731' });

    expect(result.appId).toBe('com.midasplayer.apps.candycrushsaga');
    expect(result.title).toBe('Candy Crush Saga');

    // Second call should use cache (testing cache hit path)
    const cachedResult = await memoizedStore.app({ id: '553834731' });
    expect(cachedResult.appId).toBe('com.midasplayer.apps.candycrushsaga');
  }, 15000);

  test('should memoize the results with custom options', async () => {
    const memoizedStore = memoized({ maxAge: 1000, max: 10 });
    const result = await memoizedStore.app({ id: '553834731' });

    expect(result.appId).toBe('com.midasplayer.apps.candycrushsaga');
    expect(result.title).toBe('Candy Crush Saga');
  }, 15000);

  test('should throw error when neither id nor appId provided', async () => {
    await expect(app({} as { id?: string })).rejects.toThrow('Either id or appId is required');
  });
});
