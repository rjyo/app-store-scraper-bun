/**
 * Tests for similar method
 */

import { test, expect, describe } from 'bun:test';
import { similar } from '../src/index.ts';
import { assertValidApp } from './common.ts';

describe('Similar method', () => {
  test('should fetch similar apps by id', async () => {
    const apps = await similar({ id: '553834731' });

    expect(Array.isArray(apps)).toBe(true);

    // Similar apps might be empty for some apps
    if (apps.length > 0) {
      apps.forEach(assertValidApp);
    }
  }, 15000);

  test('should fetch similar apps by appId', async () => {
    const apps = await similar({ appId: 'com.midasplayer.apps.candycrushsaga' });

    expect(Array.isArray(apps)).toBe(true);

    if (apps.length > 0) {
      apps.forEach(assertValidApp);
    }
  }, 30000);

  test('should throw error when neither id nor appId provided', async () => {
    // @ts-expect-error Testing invalid input
    await expect(similar({})).rejects.toThrow('Either id or appId is required');
  });
});
