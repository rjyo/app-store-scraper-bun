/**
 * Tests for list method
 */

import { test, expect, describe } from 'bun:test';
import { list, collection, category } from '../src/index.ts';
import { assertValidApp, assertValidUrl } from './common.ts';

describe('List method', () => {
  test('should fetch a valid application list for the given category and collection', async () => {
    const apps = await list({
      category: category.GAMES_ACTION,
      collection: collection.TOP_FREE_IOS,
    });

    expect(apps.length).toBeGreaterThan(0);
    apps.forEach((app) => {
      assertValidApp(app);
      expect(app.free).toBe(true);
    });
  }, 15000);

  test('should validate the category', async () => {
    await expect(
      list({
        // @ts-expect-error Testing invalid category
        category: 'wrong',
        collection: collection.TOP_FREE_IOS,
      })
    ).rejects.toThrow('Invalid category wrong');
  });

  test('should validate the collection', async () => {
    await expect(
      list({
        category: category.GAMES_ACTION,
        // @ts-expect-error Testing invalid collection
        collection: 'wrong',
      })
    ).rejects.toThrow('Invalid collection wrong');
  });

  test('should validate the results number', async () => {
    await expect(
      list({
        category: category.GAMES_ACTION,
        collection: collection.TOP_FREE_IOS,
        num: 250,
      })
    ).rejects.toThrow('Cannot retrieve more than 200 apps');
  });

  test('should fetch apps with fullDetail', async () => {
    const apps = await list({
      collection: collection.TOP_FREE_IOS,
      fullDetail: true,
      num: 3,
    });

    expect(apps.length).toBeGreaterThan(0);
    apps.forEach((app) => {
      assertValidApp(app);

      expect(typeof app.description).toBe('string');
      expect(app.free).toBe(true);

      expect(typeof app.developer).toBe('string');
      if ('developerWebsite' in app && app.developerWebsite) {
        assertValidUrl(app.developerWebsite);
      }
    });
  }, 30000);

  test('should use default collection when not specified', async () => {
    const apps = await list({ num: 5 });

    expect(apps.length).toBeGreaterThan(0);
    apps.forEach((app) => {
      assertValidApp(app);
    });
  }, 15000);
});
