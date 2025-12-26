/**
 * Tests for search method
 */

import { test, expect, describe } from 'bun:test';
import { search } from '../src/index.ts';
import { assertValidApp } from './common.ts';

describe('Search method', () => {
  test('should fetch a valid application list', async () => {
    const apps = await search({ term: 'Panda vs Zombies' });

    expect(apps.length).toBeGreaterThan(0);
    (apps as Awaited<ReturnType<typeof search>>).forEach((app) => {
      if (typeof app !== 'string') {
        assertValidApp(app);
      }
    });
  }, 15000);

  test('should properly paginate results', async () => {
    const apps1 = await search({ term: 'Panda', num: 10 });
    const apps2 = await search({ term: 'Panda', num: 10, page: 2 });

    expect(apps1.length).toBe(10);
    expect(apps2.length).toBe(10);

    (apps1 as Awaited<ReturnType<typeof search>>).forEach((app) => {
      if (typeof app !== 'string') {
        assertValidApp(app);
      }
    });

    (apps2 as Awaited<ReturnType<typeof search>>).forEach((app) => {
      if (typeof app !== 'string') {
        assertValidApp(app);
      }
    });

    // First app of each page should be different
    if (typeof apps1[0] !== 'string' && typeof apps2[0] !== 'string') {
      expect(apps1[0]!.appId).not.toBe(apps2[0]!.appId);
    }
  }, 30000);

  test('should fetch a valid application list in fr country', async () => {
    const apps = await search({ country: 'fr', term: 'Panda vs Zombies' });

    expect(apps.length).toBeGreaterThan(0);
    (apps as Awaited<ReturnType<typeof search>>).forEach((app) => {
      if (typeof app !== 'string') {
        assertValidApp(app);
      }
    });

    if (typeof apps[0] !== 'string') {
      expect(apps[0]!.url).toContain('apps.apple.com/fr');
    }
  }, 15000);

  test('should validate the results number', async () => {
    const count = 5;
    const apps = await search({
      term: 'vr',
      num: count,
    });

    expect(apps.length).toBe(count);
    (apps as Awaited<ReturnType<typeof search>>).forEach((app) => {
      if (typeof app !== 'string') {
        assertValidApp(app);
      }
    });
  }, 15000);

  test('should be able to retrieve array of application ids', async () => {
    const result = await search({
      term: 'vr',
      idsOnly: true,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.every((item) => typeof item === 'string')).toBe(true);
  }, 15000);

  test('should throw error when term is not provided', async () => {
    // @ts-expect-error Testing invalid input
    await expect(search({})).rejects.toThrow('term is required');
  });

  test('should work with throttle option', async () => {
    const apps = await search({ term: 'game', num: 2, throttle: 10 });

    expect(apps.length).toBe(2);
    (apps as Awaited<ReturnType<typeof search>>).forEach((app) => {
      if (typeof app !== 'string') {
        assertValidApp(app);
      }
    });
  }, 15000);
});
