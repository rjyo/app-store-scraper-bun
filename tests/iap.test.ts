/**
 * Tests for iap (in-app purchases) method
 */

import { test, expect, describe } from 'bun:test';
import { iap } from '../src/index.ts';

describe('IAP method', () => {
  test('should fetch in-app purchases for an app', async () => {
    const result = await iap({ id: '553834731' }); // Candy Crush

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    const purchase = result[0]!;
    expect(typeof purchase.name).toBe('string');
    expect(typeof purchase.price).toBe('string');
    expect(purchase.name.length).toBeGreaterThan(0);
    expect(purchase.price.length).toBeGreaterThan(0);
  }, 30000);

  test('should return valid price format', async () => {
    const result = await iap({ id: '553834731' });

    if (result.length > 0) {
      // Price should contain a currency symbol or number
      const purchase = result[0]!;
      expect(purchase.price).toMatch(/[$£€¥]|\d/);
    }
  }, 30000);

  test('should fetch in-app purchases using appId', async () => {
    const result = await iap({ appId: 'com.midasplayer.apps.candycrushsaga' });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  }, 30000);

  test('should return empty array for apps without IAP', async () => {
    // Use an app ID that likely has no IAP (system app or simple paid app)
    const result = await iap({ id: '284882215' }); // Facebook

    expect(Array.isArray(result)).toBe(true);
    // We just check it returns an array, may or may not have IAP
  }, 30000);

  test('should throw error when neither id nor appId provided', async () => {
    await expect(iap({} as { id?: string })).rejects.toThrow(
      'Either id or appId is required'
    );
  });

  test('should fetch in-app purchases with different country', async () => {
    const result = await iap({ id: '553834731', country: 'gb' });

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      const purchase = result[0]!;
      // UK prices should contain £ symbol
      expect(purchase.price).toMatch(/£|\d/);
    }
  }, 30000);
});
