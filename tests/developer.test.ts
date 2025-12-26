/**
 * Tests for developer method
 */

import { test, expect, describe } from 'bun:test';
import { developer } from '../src/index.ts';
import { assertValidApp } from './common.ts';

describe('Developer method', () => {
  test('should fetch apps by developer id', async () => {
    // King developer ID
    const apps = await developer({ devId: 526656015 });

    expect(apps.length).toBeGreaterThan(0);
    apps.forEach(assertValidApp);
  }, 15000);

  test('should throw error for invalid developer id', async () => {
    await expect(developer({ devId: 123 })).rejects.toThrow('Developer not found (404)');
  }, 15000);

  test('should throw error when devId is not provided', async () => {
    // @ts-expect-error Testing invalid input
    await expect(developer({})).rejects.toThrow('devId is required');
  });
});
